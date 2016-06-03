@ECHO OFF
for %%X in (./images_src/*.jpg) do convert ./images_src/%%X -resize 1024 ./images/1240/%%X 
for %%Y in (./images_src/*.jpg) do convert ./images_src/%%Y -resize 640 ./images/640/%%Y
for %%Z in (./images_src/*.jpg) do convert ./images_src/%%Z -resize 320 ./images/320/%%Z 
