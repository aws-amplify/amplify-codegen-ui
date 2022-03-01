# Testing Strategy

Our tests are broken up into a few categories, 1) unit tests which operate on specific classes or blocks of code and run using jest, 2) functional tests which invoke the full library on an input payload, and verify the output shape is generated as expected, also runnning on jest. 3) Integration tests which verify that library can be invoked and that the resultant components can be hosted in an app, and that various aspects of that app meet spec, these run using cypress. 4) End-to-end tests that verify an Amplify app in the cloud can be pulled down using the CLI, run in an app, and that the app works as expected.

This directory is intended to aid with test type 2, and possibly 3 in the future. We maintain a series of example component JSON schemas which represent expected input values, as well as the expected resulting code (in whatever platforms we support). Because a goal of this project is to generate idiomatic code as though a human has written it (or as close as possible) we wish to materialize these generated test outputs for review and inspection, as well as comparing generated code across platforms easily.

Each underlying platform implementation can access these schemas, define their own coverage requirements as they are implemented, and ensure that we have parity across all supported platforms as they come online.
