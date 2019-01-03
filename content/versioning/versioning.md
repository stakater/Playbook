# Versioning

## Version Syntax
We use Semantic Versioning (SemVer for short) for our projects. This is a popular versioning  methodology 
to get rid of the problem of "dependency hell", where managing versioning for internal and external dependencies can
become a major hurdle to the easy and safe progression of a project.
In semantic versioning, a normal version number takes the form `X.Y.Z` where `X` is the major version,
 `Y` the minor version, and `Z` the patch number. More information on Semantic Versioning can be found here.

## Version tracking
We maintain a .version file in our repository for easily tracking the current version.
Our homegrown utility is integrated into our Jenkins pipeline and calculates the version to use on release.

Based on Semver principles, if a new version has backwards compatible or incompatible functionality changes,
either the major or minor version number needs to be increased. This should be done by the developer in the .version file.
In the CD pipeline, the new version is based on either the latest git tag or the version file.
Which ever holds the greater version, is used. The utility in the CD pipeline only bumps the patch version.