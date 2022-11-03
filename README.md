# create-sonnetry

An npm initializer for @c6fc/sonnetry. Creates a new Sonnet with the following structure:

```txt
# Directories
- jsonnet/
- sonnetry_modules/

# Files
- .gitignore
- package.json
- terraform.jsonnet
```

The Sonnet's name will be set to match the directory's basename. (e.g. "/home/user/repos/mySonnet" will be named 'mySonnet').
This can be changed in package.json and terraform.jsonnet after the Sonnet has been created.

## Create Sonnet in current directory

```sh
npm init sonnetry
```

## Create Sonnet in specified directory

```sh
npm init sonnetry mySonnet
```