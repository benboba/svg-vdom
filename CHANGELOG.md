# 2020-09-10 v1.0.6

## Features

- Added judgment and error prompts that CDATA interruption cannot appear under the document root

## Fixed bugs

- Fixed the bug that accidentally reported an error when encountering the comment node under the document root
- Found and solved the problem that the test case with the parsing error did not take effect

# 2020-09-10 v1.0.4 & 1.0.5

## Fixed bugs

- Fix a misjudgment of the hasAttribute method of the tag node for attributes containing namespace
- Complete the description of the parentNode documentation for array parameters
- Modified the method of parentNode operating child nodes to avoid directly passing in childNodes of a node to cause the result to not meet expectations

# 2020-09-10 v1.0.3

## Breaking change

- The "name" in umd format is changed from "xml-parser" to "svgVdom"

## Fixed bugs

- Fix the format problem of attrModifier description document in docs
- Fix the problem that the entire node will be put into textContent when parsing text nodes

# 2020-09-08 v1.0.2

## Fixed bugs

- Remove the dependency of the files in the typings directory on the src directory

# 2020-09-08 v1.0.1

## Fixed bugs

- Fixed the problem of wrong path of d.ts file
- Add types attribute in package.json
- Removed test case related files in the release version

# 2020-09-08 v1.0.0

## Features

- first commit
