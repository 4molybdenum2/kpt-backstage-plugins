# Changelog

## [0.3.0](https://github.com/GoogleContainerTools/kpt-backstage-plugins/compare/backstage-plugin-cad-v0.2.0...backstage-plugin-cad-v0.3.0) (2022-07-22)


### Features

* add apply replacements function automatically ([#56](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/56)) ([1ebc9b8](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/1ebc9b835afaaf9594c063c0f01c09c50c88d15a))
* add cluster role and cluster role binding resource viewers ([#71](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/71)) ([e0ae65e](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/e0ae65ec5637e83ba1d40dcf3eaee8d1ed47bcce))
* add persistent volume claim resource viewer ([#73](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/73)) ([38d54ef](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/38d54ef51200c4d2ecc92707a2058783b10aba42))
* add service resource viewer ([#74](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/74)) ([fb8c217](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/fb8c21759bf108dbdba778a3779885a7a70913ef))
* add tooltips to all icon buttons ([#51](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/51)) ([2758ca8](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/2758ca80db7df75b9d4ac7f27d7bcac352c9ab17))
* allow packages to upgrade to latest blueprint ([#54](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/54)) ([b04bc3c](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/b04bc3cbd2331ab073e953aa4cef3c113d475ad5))
* config sync is optional ([#60](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/60)) ([c4c1976](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/c4c197682a31bdbdef99e742607afd934026535f))
* default compare revision dropdown ([#50](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/50)) ([09eafaa](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/09eafaa2c9f13d334e2612e4502c1ff1258845ad))
* show all previous revisions in compare revision dropdown ([#47](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/47)) ([923e81d](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/923e81db307d55009cdc509503f2b38aafddd828))
* use merge update strategy for package upgrades ([#70](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/70)) ([dd41b03](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/dd41b032a21477822857a870394411c230b200e1))


### Bug Fixes

* allow latest published blueprint to be deployed ([#63](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/63)) ([8ecf396](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/8ecf39626ce74fb6b6e222f7e1332a25e36542f7))
* allow upstream package comparison ([#61](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/61)) ([292b98d](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/292b98d61790a7bb82d5ee777a3b23455db0dc6a))

## [0.2.0](https://github.com/GoogleContainerTools/kpt-backstage-plugins/compare/backstage-plugin-cad-v0.1.0...backstage-plugin-cad-v0.2.0) (2022-06-15)


### Features

* add restore package revision ([#22](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/22)) ([8c68d50](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/8c68d508974e1c54b08dbfa1f9d4d3d909ced11d))
* add service account autocompletion to role binding editor ([#38](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/38)) ([f8c9808](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/f8c9808ef4aac4dd24ee3746cbaa61df41916d67))
* show added, updated, and removed resources ([#33](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/33)) ([d8bdb0a](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/d8bdb0ab244dfce7538bc3e692eb867ae9069c58))
* show blueprint name on package summary table ([#26](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/26)) ([7c6b61b](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/7c6b61b49a880fd127e186f05bd775c88efbf4f7))
* show changes summary on package revisions table ([#37](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/37)) ([e0b661b](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/e0b661bc0c6d282a35bcf9d0fe2ff908a142d7eb))
* show diff of individual package resources ([#36](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/36)) ([c8dbd29](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/c8dbd293737f96d40ad4e24c0e43bcd75014a4ff))
* show package count on repositories table ([#31](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/31)) ([f28d527](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/f28d527547b11a7b4b40dbdbcdea518265a9cc72))


### Bug Fixes

* do not add an indentation level to array elements ([#30](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/30)) ([c79a559](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/c79a5593546591072434fbb2d64e2f4d0dc0b813))
* pass current package resources to resource editor dialog ([#39](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/39)) ([ce8daa0](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/ce8daa02599c9cb67f75414a552618a684a9c852))
* specify tasks list when restoring a package revision ([#43](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/43)) ([77641a5](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/77641a517b25f96f1ed5e76f98c25d25049e7c25))
* use double quotes when serializing yaml ([#41](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/41)) ([c2ced57](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/c2ced5753a695a983607db0ed6feb123c7bc1f09))

## [0.1.0](https://github.com/GoogleContainerTools/kpt-backstage-plugins/compare/backstage-plugin-cad-v0.0.0...backstage-plugin-cad-v0.1.0) (2022-05-25)


### Features

* create new packages with revision v1 ([#4](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/4)) ([2a114fc](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/2a114fc6ad8642c96fc629cc8b079473d674ef3a))
* create new revisions of a package ([#8](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/8)) ([cef6eae](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/cef6eaef4585646bcdd02bd1ce047ba3cb35840e))
* list revisions of a package ([#10](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/10)) ([52b4be8](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/52b4be862e18a9deb3b6b8091806efa79a15b9fa))
* rename move to draft button to reject ([#12](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/12)) ([a652bc1](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/a652bc136f30649581f4eda653500c1d2dbe461d))
* update package revision page header ([#5](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/5)) ([35615ae](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/35615ae50468dc050407e3aa92d7b90eac113621))
* update package revisions table ([#9](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/9)) ([7fb1174](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/7fb11749579a95a0ab58effe684ae75c1f4f469a))


### Bug Fixes

* resources table delete button no longer increases row height ([#14](https://github.com/GoogleContainerTools/kpt-backstage-plugins/issues/14)) ([2e81f7d](https://github.com/GoogleContainerTools/kpt-backstage-plugins/commit/2e81f7dd44485cd602fffad2638d70832d1e4ee9))
