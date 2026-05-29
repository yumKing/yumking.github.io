# git 记录

## git 命令相关
git log --max-count=3 --format=oneline --date-order branch1 --
git log --max-count=3 --date-order branch1 --
git log --max-count=3 --format="%h (%ad) %an %s" --date=iso --date-order branch1 --

git log --follow -p -- [file]

git diff [other_branch] -- [file]

## 特殊操作

git log --author="xx" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "新增行数: %s, 删除行数: %s, 净增行数: %s\n", add, subs, loc }'

## pwsh git 统计
Get-GitDailyStats-Pro -Author "xxx" -Since "2026-05-01" -ShowChart -NoZero

### git stat function
function Get-GitDailyStats {
    param(
        [string]$Author = $env:USERNAME,
        [string]$Since  = "",
        [string]$Until  = ""
    )
    
    $results = @()
    $currentDate = $null
    $add = 0; $subs = 0
    
    $gitArgs = @("log", "--author=$Author", "--date=short", "--pretty=tformat:%ad", "--numstat")
    if ($Since) { $gitArgs += "--since=$Since" }
    if ($Until) { $gitArgs += "--until=$Until" }
    
    foreach ($line in (git @gitArgs)) {
        # 匹配日期行
        if ($line -match '^(\d{4}-\d{2}-\d{2})$') {
            $newDate = $Matches[1]
            # 🔑 核心修复：仅当日期发生变化时，才结算上一天的数据
            if ($newDate -ne $currentDate) {
                if ($currentDate -and ($add -gt 0 -or $subs -gt 0)) {
                    $results += [PSCustomObject]@{
                        Date    = $currentDate
                        Added   = $add
                        Deleted = $subs
                        Net     = $add - $subs
                    }
                }
                $currentDate = $newDate
                $add = 0; $subs = 0
            }
        }
        # 匹配代码变更行
        elseif ($line -match '^(\d+)\s+(\d+)\s+') {
            $add += [int]$Matches[1]
            $subs += [int]$Matches[2]
        }
    }
    
    # 保存最后一天
    if ($currentDate -and ($add -gt 0 -or $subs -gt 0)) {
        $results += [PSCustomObject]@{
            Date    = $currentDate
            Added   = $add
            Deleted = $subs
            Net     = $add - $subs
        }
    }
    
    return $results | Sort-Object Date -Descending
}

### ========== 增强版（带汇总/图表/过滤） ==========
function Get-GitDailyStats-Pro {
    param(
        [string]$Author,
        [string]$Since,
        [string]$Until,
        [switch]$ShowChart,
        [switch]$NoZero
    )
    
    $results = Get-GitDailyStats -Author $Author -Since $Since -Until $Until
    if ($NoZero) { $results = $results | Where-Object { $_.Added -gt 0 -or $_.Deleted -gt 0 } }
    
    $totalAdded   = ($results | Measure-Object Added -Sum).Sum
    $totalDeleted = ($results | Measure-Object Deleted -Sum).Sum
    $totalNet     = $totalAdded - $totalDeleted
    
    Write-Host "`n📅 按天统计 (@$Author)" -ForegroundColor Cyan
    foreach ($row in $results) {
        $chart = if ($ShowChart) { "│" + ("█" * [Math]::Min($row.Added / 10, 30)) } else { "" }
        $arrow = if ($row.Net -ge 0) { "📈" } else { "📉" }
        $color = if ($row.Net -ge 0) { "Green" } else { "Yellow" }
        
        Write-Host ("{0} | +{1,-5} -{2,-5} net:{3,-5} {4} " -f 
            $row.Date, $row.Added, $row.Deleted, $row.Net, $chart) -NoNewline
        Write-Host $arrow -ForegroundColor $color
    }
    
    Write-Host "`n📊 汇总" -ForegroundColor Cyan
    Write-Host "  总新增 : $totalAdded" -ForegroundColor Green
    Write-Host "  总删除 : $totalDeleted" -ForegroundColor Red
    Write-Host "  净增   : $totalNet" -ForegroundColor $(if($totalNet -ge 0){"Green"}else{"Yellow"})
    Write-Host "  统计天数: $($results.Count)`n"
    
    return $results
}
