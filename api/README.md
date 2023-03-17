# ConcoursPhoto documentation

## Configuration de l'environnement de travail

__Si vous êtes sur Windows__

Installez Chocolatey pour pouvoir installer OpenSSL

Exécuter PowerShell en tant qu'administrateur et lancez la commande suivante :

```
Set-ExecutionPolicy Bypass -Scope Process -Force; iwr https://community.chocolatey.org/install.ps1 -UseBasicParsing | iex
```

Source : [Chocolatey](https://community.chocolatey.org/courses/installation/installing?method=installing-chocolatey)

Ouvrez le projet et exécuter cette commande pour générer votre clé publique et secrète via Lexik :

```
php bin/console lexik:jwt:generate-keypair
```

Installer les packages Composer :

```
composer install
```

## Configuration de l'API

- Démarrer l'API avec la commande suivante :

```
symfony server:start -d
```
- Créer votre base de données avec :

```
php bin/console doctrine:database:create
```

- Mettre à jour la base de données :

```
php bin/console doctrine:schema:update --force
```

- Générer les jeux d'essais :

```
php bin/console doctrine:fixtures:load
```
