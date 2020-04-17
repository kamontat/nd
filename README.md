<p align="center">
  <img src="./docs/assets/icon.png" width="120px">
</p>

<!-- Title -->
<h1 align="center">
  ND - Novel Downloader

  <img alt="release version" src="https://img.shields.io/github/v/release/kamontat/nd?label=release&include_prereleases&logo=github&logoColor=white&sort=semver&style=flat-square">

  <img alt="release version" src="https://img.shields.io/github/release-date-pre/kamontat/nd?label=date&logo=github&logoColor=white&style=flat-square">
</h1>

<!-- description -->
<p align="center">
  <strong>ND is a commandline tools for download novel from supported sources in parallel</strong>
</p>

<!-- Internal link -->
<h4 align="center">
  <a href="docs/Usecases.md">Usecases</a>
  <span> · </span>
  <a href="docs/Business.md">Business</a>
  <span> · </span>
  <a href="docs/Technical.md">Technical</a>
  <span> · </span>
  <a href="docs/reports/CHANGELOG.md">Changelog</a>
  <span> · </span>
  <a href="docs/reports/loc">Line of code</a>
</h4>

## Important

Consider to the next step. The problem is we cannot build single file execuable with pkg anymore because firebase libraries have their own Native modules. until pkg packager resolve this problem ([pkg#837](https://github.com/zeit/pkg/pull/837). We might need to consider alternative option. As discuss early we might move the code to [electron](https://electronjs.org/) for built real application for normal users.

## Badges

This badge will represent informative of the repository

### Information

| Name         | Badge                                           |
| ------------ | ----------------------------------------------- |
| Avg. commit  | ![gh-avg-commit-monthly][gh-avg-commit-monthly] |
| Top language | ![gh-top-language][gh-top-language]             |
| Repo size    | ![gh-repo-size][gh-repo-size]                   |
| Code size    | ![gh-code-size][gh-code-size]                   |

### Test and Coverage

| Name     | Badge                                        |
| -------- | -------------------------------------------- |
| Unittest | [![circleci][circleci-badge]][circleci-link] |
| Coverage | [![codecov][codecov-badge]][codecov-link]    |

### Analytic and Security

| Name            | Badge                                                                      |
| --------------- | -------------------------------------------------------------------------- |
| Quality gate    | [![sonar-qg][sonar-qg-badge]][sonar-link]                                  |
| Duplication     | [![sonar-dup][sonar-dup-badge]][sonar-dup-link]                            | 
| Maintainability | [![sonar-maintain][sonar-maintain-badge]][sonar-maintain-link]             |
| Reliability     | [![sonar-rel][sonar-rel-badge]][sonar-rel-link]                            |
| Security        | [![sonar-secure][sonar-secure-badge]][sonar-secure-link]                   |
| Technival Debt  | [![sonar-tech-debt][sonar-tech-debt-badge]][sonar-tech-debt-link]          |
| Violations      | [![sonar-violation][sonar-violation-badge]][sonar-link]                    |
| Vulnerabilities | [![sonar-vulnerabilities][sonar-vulnerabilities-badge]][sonar-secure-link] |

### Dependencies

| Name                 | Badge                                           |
| -------------------- | ----------------------------------------------- |
| Dependencies         | [![david][david-badge]][david-link]             |
| Develop Dependencies | [![david-dev][david-dev-badge]][david-dev-link] |

[gh-avg-commit-monthly]: https://img.shields.io/github/commit-activity/m/kamontat/nd?label=activity&logo=github&logoColor=white&style=flat-square
[gh-top-language]: https://img.shields.io/github/languages/top/kamontat/nd?logo=github&logoColor=white&style=flat-square
[gh-repo-size]: https://img.shields.io/github/repo-size/kamontat/nd?logo=github&logoColor=white&style=flat-square
[gh-code-size]: https://img.shields.io/github/languages/code-size/kamontat/nd?logo=github&logoColor=white&style=flat-square

[circleci-badge]: https://img.shields.io/circleci/build/github/kamontat/nd?logo=circleci&logoColor=white&style=flat-square
[circleci-link]: https://circleci.com/gh/kamontat/workflows/nd

[codecov-badge]: https://img.shields.io/codecov/c/github/kamontat/nd?logo=codecov&logoColor=white&style=flat-square
[codecov-link]: https://codecov.io/gh/kamontat/nd

[david-badge]: https://img.shields.io/david/kamontat/nd?style=flat-square
[david-link]: https://david-dm.org/kamontat/nd
[david-dev-badge]: https://img.shields.io/david/dev/kamontat/nd?style=flat-square
[david-dev-link]: https://david-dm.org/kamontat/nd?type=dev

[sonar-link]: https://sonarcloud.io/dashboard?id=kamontat_nd

[sonar-qg-badge]: https://sonarcloud.io/api/project_badges/measure?project=kamontat_nd&metric=alert_status

[sonar-dup-badge]: https://sonarcloud.io/api/project_badges/measure?project=kamontat_nd&metric=duplicated_lines_density
[sonar-dup-link]: https://sonarcloud.io/component_measures?id=kamontat_nd&metric=Duplications&view=list

[sonar-maintain-badge]: https://sonarcloud.io/api/project_badges/measure?project=kamontat_nd&metric=sqale_rating
[sonar-maintain-link]: https://sonarcloud.io/component_measures?id=kamontat_nd&metric=Maintainability&view=list

[sonar-rel-badge]: https://sonarcloud.io/api/project_badges/measure?project=kamontat_nd&metric=reliability_rating
[sonar-rel-link]: https://sonarcloud.io/component_measures?id=kamontat_nd&metric=Reliability&view=list

[sonar-secure-badge]: https://sonarcloud.io/api/project_badges/measure?project=kamontat_nd&metric=security_rating
[sonar-vulnerabilities-badge]: https://sonarcloud.io/api/project_badges/measure?project=kamontat_nd&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=kamontat_nd
[sonar-secure-link]: https://sonarcloud.io/component_measures?id=kamontat_nd&metric=Security&view=list

[sonar-tech-debt-badge]: https://sonarcloud.io/api/project_badges/measure?project=kamontat_nd&metric=sqale_index
[sonar-tech-debt-link]: https://sonarcloud.io/component_measures?id=kamontat_nd&metric=sqale_index&view=list

[sonar-violation-badge]: https://img.shields.io/sonar/violations/kamontat_nd?format=long&server=https%3A%2F%2Fsonarcloud.io&style=flat-square
