// Copyright 2019 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --harmony-top-level-await

import * as m from 'modules-skip-1-top-level-await.mjs'

assertEquals(42, m.life());
