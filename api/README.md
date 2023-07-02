# ConcoursPhoto documentation

## Configuration de l'environnement de travail

**Si vous êtes sur Windows**

Installez Chocolatey pour pouvoir installer OpenSSL

Exécuter PowerShell en tant qu'administrateur et lancez la commande suivante :

```
Set-ExecutionPolicy Bypass -Scope Process -Force; iwr https://community.chocolatey.org/install.ps1 -UseBasicParsing | iex
```

Source : [Chocolatey](https://community.chocolatey.org/courses/installation/installing?method=installing-chocolatey)

On installe OpenSSL avec la commande suivante :

```
choco install openssl
```

Ouvrez le projet et exécuter cette commande pour générer votre clé publique et secrète via Lexik :

```
cd api && php bin/console lexik:jwt:generate-keypair
```

Installer les packages Composer :

```
cd api && composer install
```

Installer les packages Npm :

```
cd client && npm install
```

## Configuration de l'API

```
cd api
```

-   Créer un fichier .env.local à la racine du projet et ajouter les informations suivantes :

```
###> doctrine/doctrine-bundle ###
# Format described at https://www.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/configuration.html#connecting-using-a-url
# IMPORTANT: You MUST configure your server version, either here or in config/packages/doctrine.yaml
#
# DATABASE_URL="sqlite:///%kernel.project_dir%/var/data.db"
DATABASE_URL="mysql://root:root@127.0.0.1:3307/concoursphoto?serverVersion=8&charset=utf8mb4"
# DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=15&charset=utf8"
###< doctrine/doctrine-bundle ###
```

-   Démarrer l'API avec la commande suivante :

```
symfony server:start -d
```

-   Créer votre base de données avec :

```
php bin/console doctrine:database:create
```

-   Mettre à jour la base de données :

```
php bin/console doctrine:schema:update --force
```

-   Générer les jeux d'essais :

```
php bin/console doctrine:fixtures:load
```

## Configuration du SMTP (Mail)

-   Créer un compte sur [Mailtrap](https://mailtrap.io/) et récupérer les informations de connexion SMTP

-   Ajouter les informations suivantes dans le fichier .env.local :

```
###> symfony/mailer ###
MAILER_DSN=smtp://<username>:<password>@<host>:<port>
###< symfony/mailer ###
```

## Démarrer le projet (en environnement de développement)

-   Démarrer le projet (à la fois l'API et le client) avec la commande suivante à la racine du projet :

```
npm run dev
```
