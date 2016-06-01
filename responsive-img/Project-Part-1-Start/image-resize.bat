@ECHO OFF
for %%X in (./images_src/*.jpg) do convert ./images_src/%%X -resize 1024 ./images/%%X 
