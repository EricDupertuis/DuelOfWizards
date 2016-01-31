#!/usr/bin/env fish

for img in (find raw_assets/cards/ -name "*.png")
    set dst (echo $img | sed "s/raw_assets\/cards/assets\/cards/")
    echo "Converting $img"

    convert $img -resize 375x500 $dst
end
