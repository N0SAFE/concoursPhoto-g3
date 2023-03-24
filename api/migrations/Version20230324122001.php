<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230324122001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE competition CHANGE country_criteria country_criteria JSON NOT NULL, CHANGE region_criteria region_criteria JSON NOT NULL, CHANGE department_criteria department_criteria JSON NOT NULL, CHANGE city_criteria city_criteria JSON NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE competition CHANGE country_criteria country_criteria VARCHAR(255) NOT NULL, CHANGE region_criteria region_criteria VARCHAR(255) NOT NULL, CHANGE department_criteria department_criteria VARCHAR(255) NOT NULL, CHANGE city_criteria city_criteria VARCHAR(255) NOT NULL');
    }
}
