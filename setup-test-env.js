// This file gets run automatically by Jest before every test and therefore you
// don’t need to add the imports here to every single test file.

import "jest-dom/extend-expect"

// Mock the fetch function.
import mockFetch from 'jest-fetch-mock';
global.fetch = mockFetch;
