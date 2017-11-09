#!/bin/bash

firestore-backup --accountCredentials doocrate-firebase-private-key.json --backupPath . --prettyPrint

find ./tasks/ -type f -name '**.json' -exec cat {} + > tasks.txt
find ./comments/ -type f -name '**.json' -exec cat {} + > comments.txt
find ./users/ -type f -name '**.json' -exec cat {} + > users.txt

echo Now we need to go over those files and replace }{ with },{ add in the begining of each file [ and close it with ] and that should make the file valid
