<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230502121509 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE organization_link (id INT AUTO_INCREMENT NOT NULL, organization_id INT DEFAULT NULL, social_networks_id INT DEFAULT NULL, link VARCHAR(255) DEFAULT NULL, INDEX IDX_FA5A76C32C8A3DE (organization_id), INDEX IDX_FA5A76C15E9FC52 (social_networks_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE social_networks (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_link (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, social_networks_id INT DEFAULT NULL, link VARCHAR(255) DEFAULT NULL, INDEX IDX_4C2DD538A76ED395 (user_id), INDEX IDX_4C2DD53815E9FC52 (social_networks_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE organization_link ADD CONSTRAINT FK_FA5A76C32C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id)');
        $this->addSql('ALTER TABLE organization_link ADD CONSTRAINT FK_FA5A76C15E9FC52 FOREIGN KEY (social_networks_id) REFERENCES social_networks (id)');
        $this->addSql('ALTER TABLE user_link ADD CONSTRAINT FK_4C2DD538A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_link ADD CONSTRAINT FK_4C2DD53815E9FC52 FOREIGN KEY (social_networks_id) REFERENCES social_networks (id)');
        $this->addSql('ALTER TABLE organization CHANGE city citycode VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE sponsors ADD logo_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE sponsors ADD CONSTRAINT FK_9A31550FF98F144A FOREIGN KEY (logo_id) REFERENCES file (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9A31550FF98F144A ON sponsors (logo_id)');
        $this->addSql('ALTER TABLE user ADD citycode VARCHAR(255) DEFAULT NULL, DROP city, DROP socials_networks');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE organization_link DROP FOREIGN KEY FK_FA5A76C32C8A3DE');
        $this->addSql('ALTER TABLE organization_link DROP FOREIGN KEY FK_FA5A76C15E9FC52');
        $this->addSql('ALTER TABLE user_link DROP FOREIGN KEY FK_4C2DD538A76ED395');
        $this->addSql('ALTER TABLE user_link DROP FOREIGN KEY FK_4C2DD53815E9FC52');
        $this->addSql('DROP TABLE organization_link');
        $this->addSql('DROP TABLE social_networks');
        $this->addSql('DROP TABLE user_link');
        $this->addSql('ALTER TABLE organization CHANGE citycode city VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE sponsors DROP FOREIGN KEY FK_9A31550FF98F144A');
        $this->addSql('DROP INDEX UNIQ_9A31550FF98F144A ON sponsors');
        $this->addSql('ALTER TABLE sponsors DROP logo_id');
        $this->addSql('ALTER TABLE user ADD socials_networks VARCHAR(255) DEFAULT NULL, CHANGE citycode city VARCHAR(255) DEFAULT NULL');
    }
}
