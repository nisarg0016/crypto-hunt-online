# Level 5
## Task
1. A very large file with the flag is stored in the main directory with the `grapple.txt`
2. All the data is base64 encrypted
3. `cat` the flag stored in the file mentioned which has the flag stored as `#FLAG{}$`
4. Pipe the output to `base64 -d`
5. Pipe that output to `grep "FLAG"`

## Hints which can be provided
- Use the `help` command

## Implementation
Same as last level but add a function for `base64` using the in-build JS function