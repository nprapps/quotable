#!/usr/bin/env python

from glob import glob
import os

from fabric.api import *

import app
import app_config


"""
Template-specific functions

Changing the template functions should produce output
with fab render without any exceptions. Any file used
by the site templates should be rendered by fab render.
"""
def less():
    """
    Render LESS files to CSS.
    """
    for path in glob('less/*.less'):
        filename = os.path.split(path)[-1]
        name = os.path.splitext(filename)[0]
        out_path = 'www/css/%s.less.css' % name

        local('node_modules/bin/lessc %s %s' % (path, out_path))

def jst():
    """
    Render Underscore templates to a JST package.
    """
    local('node_modules/bin/jst --template underscore jst www/js/templates.js')

def download_copy():
    """
    Downloads a Google Doc as an .xls file.
    """
    base_url = 'https://docs.google.com/spreadsheets/d/%s/export?format=xlsx&id=%s'
    doc_url = base_url % (app_config.COPY_GOOGLE_DOC_KEY, app_config.COPY_GOOGLE_DOC_KEY)
    local('curl -o data/copy.xlsx "%s"' % doc_url)

def update_copy():
    """
    Fetches the latest Google Doc and updates local JSON.
    """
    download_copy()

def app_config_js():
    """
    Render app_config.js to file.
    """
    from app import _app_config_js

    response = _app_config_js()
    js = response[0]

    with open('www/js/app_config.js', 'w') as f:
        f.write(js)

def copy_js():
    """
    Render copy.js to file.
    """
    from app import _copy_js

    response = _copy_js()
    js = response[0]

    with open('www/js/copy.js', 'w') as f:
        f.write(js)

def render():
    """
    Render HTML templates and compile assets.
    """
    from flask import g

    update_copy()
    less()
    jst()

    app_config_js()
    copy_js()

    compiled_includes = []

    for rule in app.app.url_map.iter_rules():
        rule_string = rule.rule
        name = rule.endpoint

        if name == 'static' or name.startswith('_'):
            print 'Skipping %s' % name
            continue

        if rule_string.endswith('/'):
            filename = 'www' + rule_string + 'index.html'
        elif rule_string.endswith('.html'):
            filename = 'www' + rule_string
        else:
            print 'Skipping %s' % name
            continue

        dirname = os.path.dirname(filename)

        if not (os.path.exists(dirname)):
            os.makedirs(dirname)

        print 'Rendering %s' % (filename)

        with app.app.test_request_context(path=rule_string):
            g.compile_includes = True
            g.compiled_includes = compiled_includes

            view = app.__dict__[name]
            content = view()

            compiled_includes = g.compiled_includes

        with open(filename, 'w') as f:
            f.write(content.encode('utf-8'))

def tests():
    """
    Run Python unit tests.
    """
    local('nosetests')

"""
Deployment

Changes to deployment requires a full-stack test. Deployment
has two primary functions: Pushing flat files to S3 and deploying
code to a remote server if required.
"""
def _deploy_to_file_server(path='www'):
    local('rm -rf %s/live-data' % path)
    local('rm -rf %s/sitemap.xml' % path)

    local('rsync -vr %s/ ubuntu@%s:~/www/%s' % (path, app_config.FILE_SERVER, app_config.PROJECT_SLUG))

def assets_down(path='www/assets'):
    """
    Download assets folder from s3 to www/assets
    """
    local('aws s3 sync s3://%s/%s/ %s/ --acl "public-read" --cache-control "max-age=5" --region "us-east-1"' % (app_config.ASSETS_S3_BUCKET, app_config.PROJECT_SLUG, path))

def assets_up(path='www/assets'):
    """
    Upload www/assets folder to s3
    """
    _confirm("You are about to replace the copy of the folder on the server with your own copy. Are you sure?")

    local('aws s3 sync %s/ s3://%s/%s/ --acl "public-read" --cache-control "max-age=5" --region "us-east-1" --delete' % (
            path,
            app_config.ASSETS_S3_BUCKET,
            app_config.PROJECT_SLUG
        ))

def assets_rm(path):
    """
    remove an asset from s3 and locally
    """
    file_list = glob(path)

    if len(file_list) > 0:

        _confirm("You are about to destroy %s files. Are you sure?" % len(file_list))

        with settings(warn_only=True):

            for file_path in file_list:

                local('aws s3 rm s3://%s/%s/%s --region "us-east-1"' % (
                    app_config.ASSETS_S3_BUCKET,
                    app_config.PROJECT_SLUG,
                    file_path.replace('www/assets/', '')
                ))

                local('rm -rf %s' % path)

def _gzip(in_path='www', out_path='.gzip'):
    """
    Gzips everything in www and puts it all in gzip
    """
    local('python gzip_assets.py %s %s' % (in_path, out_path))

def deploy(remote='origin'):
    """
    Deploy the latest app.
    """
    render()
    _deploy_to_file_server()

"""
Destruction

Changes to destruction require setup/deploy to a test host in order to test.
Destruction should remove all files related to the project from both a remote
host and S3.
"""
def _confirm(message):
    answer = prompt(message, default="Not at all")

    if answer.lower() not in ('y', 'yes', 'buzz off', 'screw you'):
        exit()

def shiva_the_destroyer():
    """
    Deletes the app from s3
    """
    # TODO: not updated for file_server
    pass
