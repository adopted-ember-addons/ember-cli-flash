# Changelog

The noteworthy changes made to Ember-CLI-Flash are included here. For a complete
changelog, see the git history.

[npm page](https://www.npmjs.com/package/ember-cli-flash)

## 1.7.2 (2019-05-16)

#### :bug: Bug Fix
* [#299](https://github.com/poteto/ember-cli-flash/pull/299) Fix guidFor import ([@villander](https://github.com/villander))

#### Committers: 1
- Michael Villander ([@villander](https://github.com/villander))

## 1.7.1 (2019-01-08)

#### :memo: Documentation
* [#290](https://github.com/poteto/ember-cli-flash/pull/290) Documentation update for 1.7.0 ([@cythrawll](https://github.com/cythrawll))

#### Committers: 3
- Brian Runnells ([@Dhaulagiri](https://github.com/Dhaulagiri))
- Chad ([@cythrawll](https://github.com/cythrawll))
- Olle Jonsson ([@olleolleolle](https://github.com/olleolleolle))


## 1.7.0 (2018-12-12)

#### :rocket: Enhancement
* [#284](https://github.com/poteto/ember-cli-flash/pull/284) provide default config/overrides to FlashMessageService w/o injections ([@fivetanley](https://github.com/fivetanley))

#### :house: Internal
* [#277](https://github.com/poteto/ember-cli-flash/pull/277) ember-cli 3.3 ([@Dhaulagiri](https://github.com/Dhaulagiri))
* [#285](https://github.com/poteto/ember-cli-flash/pull/285) fix broken test ([@sbatson5](https://github.com/sbatson5))
* [#283](https://github.com/poteto/ember-cli-flash/pull/283) Migrate to circle 2.0 ([@Darshan-Chauhan](https://github.com/Darshan-Chauhan))

#### Committers: 4
- Brian Runnells ([@Dhaulagiri](https://github.com/Dhaulagiri))
- Darshan Chauhan ([@Darshan-Chauhan](https://github.com/Darshan-Chauhan))
- Scott Batson ([@sbatson5](https://github.com/sbatson5))
- Stanley Stuart ([@fivetanley](https://github.com/fivetanley))


## 1.6.4 (2018-06-06)

#### :rocket: Enhancement
* [#269](https://github.com/poteto/ember-cli-flash/pull/269) add aria-label and others to flash message attrs ([@sbatson5](https://github.com/sbatson5))
* [#263](https://github.com/poteto/ember-cli-flash/pull/263) update blueprint to handle newer test-helper.js ([@bgentry](https://github.com/bgentry))
* [#260](https://github.com/poteto/ember-cli-flash/pull/260) remove requirement for providing a message ([@st-h](https://github.com/st-h))

#### :memo: Documentation
* [#267](https://github.com/poteto/ember-cli-flash/pull/267) Update readme to use new modules syntax ([@dcyriller](https://github.com/dcyriller))

#### :house: Internal
* [#266](https://github.com/poteto/ember-cli-flash/pull/266) Upgrade to ember 3.0 ([@jmar910](https://github.com/jmar910))
* [#258](https://github.com/poteto/ember-cli-flash/pull/258) Add ambient TypeScript type information ([@mike-north](https://github.com/mike-north))

#### Committers: 6
- Blake Gentry ([@bgentry](https://github.com/bgentry))
- Cyrille David ([@dcyriller](https://github.com/dcyriller))
- James Martinez ([@jmar910](https://github.com/jmar910))
- Mike North ([@mike-north](https://github.com/mike-north))
- Scott Batson ([@sbatson5](https://github.com/sbatson5))
- Steve ([@st-h](https://github.com/st-h))


## show (2017-12-07)

#### :rocket: Enhancement
* [#254](https://github.com/poteto/ember-cli-flash/pull/254) extendTimeout on sticky message ([@Dhaulagiri](https://github.com/Dhaulagiri))

#### Committers: 1
- Brian Runnells ([@Dhaulagiri](https://github.com/Dhaulagiri))


## 1.6.2 (2017-12-07)

#### :rocket: Enhancement
* [#254](https://github.com/poteto/ember-cli-flash/pull/254) extendTimeout on sticky message ([@Dhaulagiri](https://github.com/Dhaulagiri))

#### Committers: 1
- Brian Runnells ([@Dhaulagiri](https://github.com/Dhaulagiri))


## 1.6.0 (2017-11-27)

#### :house: Internal
* [#250](https://github.com/poteto/ember-cli-flash/pull/250) remove deps we don't use ([@Dhaulagiri](https://github.com/Dhaulagiri))
* [#251](https://github.com/poteto/ember-cli-flash/pull/251) Update LICENSE.md ([@Dhaulagiri](https://github.com/Dhaulagiri))
* [#249](https://github.com/poteto/ember-cli-flash/pull/249) ember-cli-update to 2.16 ([@Dhaulagiri](https://github.com/Dhaulagiri))

#### Committers: 4
- Brian Runnells ([@Dhaulagiri](https://github.com/Dhaulagiri))
- Jeff Felchner ([@jfelchner](https://github.com/jfelchner))
- Scott Batson ([@sbatson5](https://github.com/sbatson5))
- Steve ([@sdhull](https://github.com/sdhull))

## [1.5.0]
  - Upgrade to Ember 2.15 [243](https://github.com/poteto/ember-cli-flash/pull/243) & [236](https://github.com/poteto/ember-cli-flash/pull/236)
  - Prevent early destruction from mouse events [241](https://github.com/poteto/ember-cli-flash/pull/241)
  - Minor typo errors [238](https://github.com/poteto/ember-cli-flash/pull/238)
  - Remove bower
  - Fix deprecation warnings related to outdate dependencies

## [1.4.3]
  - Pass 'close' as closure action
  [233](https://github.com/poteto/ember-cli-flash/pull/230)

## [1.4.2]
  - Add onDestroy callback method for flash object destroy [211](https://github.com/poteto/ember-cli-flash/pull/211)

## [1.4.1]
  - Remove Usage of Deprecated Ember.K Method [224](https://github.com/poteto/ember-cli-flash/pull/224)
  - Add check on mouseover for sticky messages [223](https://github.com/poteto/ember-cli-flash/pull/223)

## [1.4.0]

  - Add changelog for release notes [220](https://github.com/poteto/ember-cli-flash/pull/220)
  - Fix failing tests [218](https://github.com/poteto/ember-cli-flash/pull/218)
  - Update Acceptance test example in README to fail appropriately [217](https://github.com/poteto/ember-cli-flash/pull/217)
  - Add ability to return flash object [214](https://github.com/poteto/ember-cli-flash/pull/214)
  - Defer removal of flash message on mouse over [209](https://github.com/poteto/ember-cli-flash/pull/209)

## [1.3.17]

  - Fixed deprecation warnings from Ember 2.8.0 [205](https://github.com/poteto/ember-cli-flash/pull/205)
  - Small updates to README [186](https://github.com/poteto/ember-cli-flash/pull/186)
  - Update Ember-CLI to 2.7.0 [201](https://github.com/poteto/ember-cli-flash/pull/201)

## [1.3.16]

  - Update Ember-CLI to 2.6.1 [169](https://github.com/poteto/ember-cli-flash/pull/169)
  - Add destroyOnClick option [157](https://github.com/poteto/ember-cli-flash/pull/157)
  - Clarify documentation on integration tests [165](https://github.com/poteto/ember-cli-flash/pull/165)
  - Update Travis to use Trust builds

## [1.3.15]

  - Test against Ember 2.4 and 2.5

## [1.3.14]

  - Compute guid on .toString() version of the message [149](https://github.com/poteto/ember-cli-flash/pull/149)

## [1.3.13]

  - Fix calling set on destroyed object error [148](https://github.com/poteto/ember-cli-flash/pull/148)
  - Add demo app [147](https://github.com/poteto/ember-cli-flash/pull/147)

## [1.3.12]

  - Fix for apps with no defaults defined [145](https://github.com/poteto/ember-cli-flash/pull/145)
  - Minor fix for exports [144](https://github.com/poteto/ember-cli-flash/pull/144)

## [1.3.11]

  - Fix iteration of wrong array initializer [143](https://github.com/poteto/ember-cli-flash/pull/143)
  - Update README with remove of injectionFactories [137](https://github.com/poteto/ember-cli-flash/pull/137)

## [1.3.10]

  - Update ember-cli [135](https://github.com/poteto/ember-cli-flash/pull/135)
  - Deprecate use of injectionFactories [134](https://github.com/poteto/ember-cli-flash/pull/134)

## [1.3.9]

  - Update ember-cli [130](https://github.com/poteto/ember-cli-flash/pull/130)
  - Add active class in run.next [129](https://github.com/poteto/ember-cli-flash/pull/129)
  - Minor JSCS fixes [129](https://github.com/poteto/ember-cli-flash/pull/129)

## [1.3.8]

  - Fix acceptance test bug due to old blueprint [119](https://github.com/poteto/ember-cli-flash/pull/119)

## [1.3.7]

  - Implement fluent API to support chaining [118](https://github.com/poteto/ember-cli-flash/pull/118)

## [1.3.6]

  - Fix syntax error in README for custom messages example [110](https://github.com/poteto/ember-cli-flash/pull/110)
  - Update ember-new-computed for flexibility [109](https://github.com/poteto/ember-cli-flash/pull/109)

## [1.3.5]

  - Add CircleCI badge to README
  - General cleanup of flash object and component [108](https://github.com/poteto/ember-cli-flash/pull/108)
  - General cleanup for flash service [107](https://github.com/poteto/ember-cli-flash/pull/107)
  - Update to remove Ember 2.1 deprecation warning [105](https://github.com/poteto/ember-cli-flash/pull/105)
