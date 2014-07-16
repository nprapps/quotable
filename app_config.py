#!/usr/bin/env python

"""
Project-wide application configuration.

DO NOT STORE SECRETS, PASSWORDS, ETC. IN THIS FILE.
They will be exposed to users. Use environment variables instead.
See get_secrets() below for a fast way to access them.
"""

import os

"""
NAMES
"""
# Project name used for display
PROJECT_NAME = 'quotable'

# Project name in urls
# Use dashes, not underscores!
PROJECT_SLUG = 'quotable'

# The name of the repository containing the source
REPOSITORY_NAME = 'quotable'
REPOSITORY_URL = 'git@github.com:nprapps/%s.git' % REPOSITORY_NAME
REPOSITORY_ALT_URL = None # 'git@bitbucket.org:nprapps/%s.git' % REPOSITORY_NAME'

# The name to be used in paths on the server
PROJECT_FILENAME = 'quotable'

"""
DEPLOYMENT
"""
FILE_SERVER = 'tools.apps.npr.org'
S3_BUCKET = 'tools.apps.npr.org'
ASSETS_S3_BUCKET = 'assets.apps.npr.org'

# These variables will be set at runtime. See configure_targets() below
DEBUG = True

"""
COPY EDITING
"""
COPY_GOOGLE_DOC_KEY = '0AlXMOHKxzQVRdHZuX1UycXplRlBfLVB0UVNldHJYZmc'

"""
SHARING
"""
PROJECT_DESCRIPTION = 'An opinionated project template for (mostly) server-less apps.'
SHARE_URL = 'http://%s/%s/' % (S3_BUCKET, PROJECT_SLUG)

TWITTER = {
    'TEXT': PROJECT_NAME,
    'URL': SHARE_URL,
    # Will be resized to 120x120, can't be larger than 1MB
    'IMAGE_URL': ''
}

FACEBOOK = {
    'TITLE': PROJECT_NAME,
    'URL': SHARE_URL,
    'DESCRIPTION': PROJECT_DESCRIPTION,
    # Should be square. No documented restrictions on size
    'IMAGE_URL': TWITTER['IMAGE_URL'],
    'APP_ID': '138837436154588'
}

GOOGLE = {
    # Thumbnail image for Google News / Search.
    # No documented restrictions on resolution or size
    'IMAGE_URL': TWITTER['IMAGE_URL']
}

NPR_DFP = {
    'STORY_ID': '203618536',
    'TARGET': 'News_NPR_News_Investigations',
    'ENVIRONMENT': 'NPRTEST',
    'TESTSERVER': 'true'
}

"""
SERVICES
"""
GOOGLE_ANALYTICS_ID = 'UA-5828686-4'

