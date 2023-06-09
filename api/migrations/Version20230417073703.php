<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230417073703 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(
            'CREATE TABLE file (id INT AUTO_INCREMENT NOT NULL, path VARCHAR(255) NOT NULL, size VARCHAR(255) NOT NULL, extension VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, default_name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB'
        );
        $this->addSql(
            'CREATE TABLE personal_statut (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB'
        );
        $this->addSql(
            'ALTER TABLE competition ADD competition_visual_id INT DEFAULT NULL, DROP competition_visual, DROP publication_start_date'
        );
        $this->addSql(
            'ALTER TABLE competition ADD CONSTRAINT FK_B50A2CB1CB3905A3 FOREIGN KEY (competition_visual_id) REFERENCES file (id)'
        );
        $this->addSql(
            'CREATE UNIQUE INDEX UNIQ_B50A2CB1CB3905A3 ON competition (competition_visual_id)'
        );
        $this->addSql(
            'ALTER TABLE organization ADD logo_id INT DEFAULT NULL, ADD number_siret VARCHAR(255) NOT NULL, CHANGE postcode postcode VARCHAR(255) NOT NULL, CHANGE logo intra_community_vat VARCHAR(255) NOT NULL'
        );
        $this->addSql(
            'ALTER TABLE organization ADD CONSTRAINT FK_C1EE637CF98F144A FOREIGN KEY (logo_id) REFERENCES file (id)'
        );
        $this->addSql(
            'CREATE UNIQUE INDEX UNIQ_C1EE637CF98F144A ON organization (logo_id)'
        );
        $this->addSql(
            'ALTER TABLE picture ADD file_id INT DEFAULT NULL, DROP file'
        );
        $this->addSql(
            'ALTER TABLE picture ADD CONSTRAINT FK_16DB4F8993CB796C FOREIGN KEY (file_id) REFERENCES file (id)'
        );
        $this->addSql(
            'CREATE UNIQUE INDEX UNIQ_16DB4F8993CB796C ON picture (file_id)'
        );
        $this->addSql(
            'ALTER TABLE user ADD personal_statut_id INT DEFAULT NULL, ADD picture_profil_id INT DEFAULT NULL, ADD department VARCHAR(255) DEFAULT NULL, CHANGE address address VARCHAR(255) DEFAULT NULL, CHANGE postcode postcode VARCHAR(255) DEFAULT NULL, CHANGE city city VARCHAR(255) DEFAULT NULL, CHANGE country country VARCHAR(255) DEFAULT NULL, CHANGE phone_number phone_number VARCHAR(255) DEFAULT NULL, CHANGE picture_profil region VARCHAR(255) DEFAULT NULL'
        );
        $this->addSql(
            'ALTER TABLE user ADD CONSTRAINT FK_8D93D649F98CFEEE FOREIGN KEY (personal_statut_id) REFERENCES personal_statut (id)'
        );
        $this->addSql(
            'ALTER TABLE user ADD CONSTRAINT FK_8D93D6492E805CC6 FOREIGN KEY (picture_profil_id) REFERENCES file (id)'
        );
        $this->addSql(
            'CREATE INDEX IDX_8D93D649F98CFEEE ON user (personal_statut_id)'
        );
        $this->addSql(
            'CREATE UNIQUE INDEX UNIQ_8D93D6492E805CC6 ON user (picture_profil_id)'
        );
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(
            'ALTER TABLE competition DROP FOREIGN KEY FK_B50A2CB1CB3905A3'
        );
        $this->addSql(
            'ALTER TABLE organization DROP FOREIGN KEY FK_C1EE637CF98F144A'
        );
        $this->addSql(
            'ALTER TABLE picture DROP FOREIGN KEY FK_16DB4F8993CB796C'
        );
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D6492E805CC6');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649F98CFEEE');
        $this->addSql('DROP TABLE file');
        $this->addSql('DROP TABLE personal_statut');
        $this->addSql('DROP INDEX UNIQ_B50A2CB1CB3905A3 ON competition');
        $this->addSql(
            'ALTER TABLE competition ADD competition_visual VARCHAR(255) NOT NULL, ADD publication_start_date DATETIME NOT NULL, DROP competition_visual_id'
        );
        $this->addSql('DROP INDEX UNIQ_C1EE637CF98F144A ON organization');
        $this->addSql(
            'ALTER TABLE organization ADD logo VARCHAR(255) NOT NULL, DROP logo_id, DROP intra_community_vat, DROP number_siret, CHANGE postcode postcode INT NOT NULL'
        );
        $this->addSql('DROP INDEX UNIQ_16DB4F8993CB796C ON picture');
        $this->addSql(
            'ALTER TABLE picture ADD file VARCHAR(255) NOT NULL, DROP file_id'
        );
        $this->addSql('DROP INDEX IDX_8D93D649F98CFEEE ON user');
        $this->addSql('DROP INDEX UNIQ_8D93D6492E805CC6 ON user');
        $this->addSql(
            'ALTER TABLE user ADD picture_profil VARCHAR(255) DEFAULT NULL, DROP personal_statut_id, DROP picture_profil_id, DROP region, DROP department, CHANGE address address VARCHAR(255) NOT NULL, CHANGE postcode postcode INT NOT NULL, CHANGE city city VARCHAR(255) NOT NULL, CHANGE country country VARCHAR(255) NOT NULL, CHANGE phone_number phone_number VARCHAR(255) NOT NULL'
        );
    }
}
