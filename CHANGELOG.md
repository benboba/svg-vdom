# 2020-12-08 v1.0.10

## Features

- Now matchSelector will judge :root pseudo-class, the rule is that the current element has no parent element, matchSelectors will skip the verification of the topmost selector containing the :root pseudo-class (due to the misjudgment, in principle, developers should try to avoid using :root Pseudo-class)

## Fixed bugs

- Fixed the parsing error of An+B in :nth-child
- Fixed documentation errors about [parse](docs/en/parse.md)

# 2020-11-11 v1.0.9

## Features

- Added a read-only attribute "children" to the ParentNode type to get all TagNodes in the child nodes
- Now matchSelector will verify [structural pseudos](https://drafts.csswg.org/selectors-4/#structural-pseudos)
- Now matchSelector will verify the :target pseudo-class (must contain id or name attributes)
- Now matchSelector will verify the :not pseudo-class
- Now matchSelector will pass the :lang, :link, :visited, :hover, :active, :focus pseudo-classes by default, and other pseudo-classes will be judged as a hit failure

## Fixed bugs

- Fixed some bugs in test cases
- Fixed an error in the parsing of the :not pseudo-class

# 2020-10-29 v1.0.8

## Features

- selector string is now allowed to start with ">"
- Now matchSelector no longer restricts pseudo-classes and only verifies pseudo-elements

# 2020-10-23 v1.0.7

## Features

- Added support for :root and ::selection to the pseudo-class/pseudo-element selector

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
