# Starter Kit
Web project start kit including tooling, best practices and template seed.

It is based on our experience in large web projects, with architecture choices
aiming for a clean, no-brainer development experience even for beginner teams.

# Getting Started

1. Install required tools `gulp` and `bower`:

    npm install -g gulp bower

2. Install project tools, go to project folder:

    npm install

3. Launch development server:

    gulp serve

# Project Structure

    gulp/                   individual gulp tasks
    sources/                project source code
    |- data/                other project data, will be copied as-is
    |- fonts/               project fonts
    |- images/              project images
    |- libraries/           bower libraries
    |- main/                main module, for entry points and global style
    |  |- main.js           js entry point
    |  +- main.less         style entry point
    |- modules/             project components and modules
    |  |- helpers/          helper services
    |  |- screens/          application screens
    |  |- shell/            application shell
    |  |- ui-components/    shared UI components
    |  |- web-services/     web services
    |  |- wrappers/         AngularJS module wrappers for external librairies
    |  +- ...               additional project modules
    |- translations/        translations files
    +- index.html           html entry point
    e2e/                    end-to-end tests
    dist/                   compiled version

# Main Tasks

TODO

# Coding Guide

TODO: naming conventions, code style, best pratices, pitfalls

- [JavaScript](docs/js-guide.md)
- [CSS](docs/css-guide.md)
- [HTML](docs/html-guide.md)


# Additional Documentation
- [Proxy configuration](docs/proxy.md)
- [installation](docs/installation.md)
- [commands](docs/commands.md)

# Roadmap

TODO

# Credits

This starter kit was initially based on a seed generated by the 
[gulp-angular](https://github.com/Swiip/generator-gulp-angular) Yeoman generator.