#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let targetPath = process.cwd();
let name = "mySonnet";

if (process.argv.length > 2) {

	// If argv[1] is a full path, use it. Otherwise treat as relative to cwd()
	if (process.argv[2].split("")[0] == "/") {
		targetPath = process.argv[2];
	} else {
		targetPath = path.join(process.cwd(), process.argv[2]);
	}

	name = path.basename(targetPath);

	console.log(`[*] Creating new Sonnet in ${targetPath} named ${name}`);

	if (!fs.existsSync(targetPath)) {
		fs.mkdirSync(targetPath, { recursive: true });
	}
} else {
	console.log(`[*] Creating new Sonnet in this directory`);
}

const filemap = Object.entries({
	gitignore: ".gitignore",
	terraform: "terraform.jsonnet",
	package: "package.json",
	dir_jsonnet: "jsonnet",
	dir_sonnetry_modules: "sonnetry_modules"
}).reduce((acc, [k, v]) => {
	acc[k] = path.join(targetPath, v);
	return acc;
}, {});

// Handle the directories:
if (!fs.existsSync(filemap.dir_jsonnet)) {
	fs.mkdirSync(filemap.dir_jsonnet, { recursive: true });
}

if (!fs.existsSync(filemap.dir_sonnetry_modules)) {
	fs.mkdirSync(filemap.dir_sonnetry_modules, { recursive: true });
}

// Create the initial files

if (!fs.existsSync(filemap.package) || 1 == 1) {
	fs.writeFileSync(filemap.package, JSON.stringify({
		name,
		version: "1.0.0",
		config: {
			tf_version: "1.2.5"
		},
		description: `${name} for Sonnetry`,
		dependencies: {
			"@c6fc/sonnetry": "^3.0.3"
		},
		scripts: {
			apply: "npx sonnetry apply terraform.jsonnet",
			deploy: "npx sonnetry apply terraform.jsonnet",
			destroy: "npx sonnetry destroy terraform.jsonnet",
			generate: "npx sonnetry generate terraform.jsonnet",
			update: "npx sonnetry apply terraform.jsonnet"
		},
		private: true
	}, null, "\t"));
} else {
	console.log(`[-] ${filemap.package} already exists. Leaving it alone.`);
}

if (!fs.existsSync(filemap.terraform) || 1 == 1) {

	fs.writeFileSync(filemap.terraform, 
`local aws = import 'aws-sdk';
local sonnetry = import 'sonnetry';
local modules = import 'modules';

{
	'backend.tf.json': sonnetry.bootstrap('${name}'),
	'provider.tf.json': {
		terraform: {
			required_providers: {
				aws: {
					source: "hashicorp/aws"
				}
			}
		},
		provider: aws.providerAliases()
	}
}`);
} else {
	console.log(`[-] ${filemap.terraform} already exists. Leaving it alone.`);
}

if (!fs.existsSync(filemap.gitignore)) {

	fs.writeFileSync(filemap.gitignore, 
`node_modules
render*`);
} else {
	console.log(`[-] ${filemap.gitignore} already exists. Leaving it alone.`);
}

console.log("\n[+] All files written. Installing @c6fc/sonnetry. This may take a few minutes.\n");

execSync("npm install", { cwd: targetPath, stdio: 'inherit' });
execSync("npm run generate", { cwd: targetPath, stdio: 'inherit' });

console.log("\n[+] All set. Good hunting.");