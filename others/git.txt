git log --max-count=3 --format=oneline --date-order branch1 --
git log --max-count=3 --date-order branch1 --
git log --max-count=3 --format="%h (%ad) %an %s" --date=iso --date-order branch1 --

git log --follow -p -- [file]

git diff [other_branch] -- [file]



git log --author="xx" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "新增行数: %s, 删除行数: %s, 净增行数: %s\n", add, subs, loc }'
