<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230702191647 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE advertising_space (id INT AUTO_INCREMENT NOT NULL, state TINYINT(1) NOT NULL, location_name VARCHAR(255) NOT NULL, height_px INT NOT NULL, width_px INT NOT NULL, reference_price INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE competition (id INT AUTO_INCREMENT NOT NULL, organization_id INT DEFAULT NULL, competition_visual_id INT DEFAULT NULL, competition_name VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, rules LONGTEXT NOT NULL, endowments LONGTEXT NOT NULL, creation_date DATETIME NOT NULL, publication_date DATETIME NOT NULL, submission_start_date DATETIME NOT NULL, submission_end_date DATETIME NOT NULL, voting_start_date DATETIME NOT NULL, voting_end_date DATETIME NOT NULL, results_date DATETIME NOT NULL, weighting_of_jury_votes DOUBLE PRECISION NOT NULL, number_of_max_votes INT NOT NULL, number_of_max_pictures INT NOT NULL, number_of_prices INT NOT NULL, min_age_criteria INT NOT NULL, max_age_criteria INT NOT NULL, country_criteria JSON NOT NULL, region_criteria JSON NOT NULL, department_criteria JSON NOT NULL, city_criteria JSON NOT NULL, is_promoted TINYINT(1) DEFAULT NULL, consultation_count INT DEFAULT NULL, competition_results VARCHAR(255) DEFAULT NULL, is_published TINYINT(1) DEFAULT NULL, activation_date DATETIME NOT NULL, INDEX IDX_B50A2CB132C8A3DE (organization_id), UNIQUE INDEX UNIQ_B50A2CB1CB3905A3 (competition_visual_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE competition_theme (competition_id INT NOT NULL, theme_id INT NOT NULL, INDEX IDX_64C2D5DE7B39D312 (competition_id), INDEX IDX_64C2D5DE59027487 (theme_id), PRIMARY KEY(competition_id, theme_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE competition_participant_category (competition_id INT NOT NULL, participant_category_id INT NOT NULL, INDEX IDX_49222EDA7B39D312 (competition_id), INDEX IDX_49222EDAE8756067 (participant_category_id), PRIMARY KEY(competition_id, participant_category_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE competition_notification_type (competition_id INT NOT NULL, notification_type_id INT NOT NULL, INDEX IDX_343411DD7B39D312 (competition_id), INDEX IDX_343411DDD0520624 (notification_type_id), PRIMARY KEY(competition_id, notification_type_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE file (id INT AUTO_INCREMENT NOT NULL, path VARCHAR(255) NOT NULL, size VARCHAR(255) NOT NULL, extension VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, default_name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE gender (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE member_of_the_jury (id INT AUTO_INCREMENT NOT NULL, competition_id INT DEFAULT NULL, user_id INT DEFAULT NULL, invite_date DATETIME NOT NULL, acceptance_date DATETIME NOT NULL, the_function VARCHAR(255) NOT NULL, INDEX IDX_40CC096B7B39D312 (competition_id), INDEX IDX_40CC096BA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE notification_type (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, notification_code INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE organization (id INT AUTO_INCREMENT NOT NULL, organization_type_id INT DEFAULT NULL, logo_id INT DEFAULT NULL, organization_visual_id INT DEFAULT NULL, state TINYINT(1) NOT NULL, organizer_name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, postcode VARCHAR(255) NOT NULL, citycode VARCHAR(255) NOT NULL, website_url VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, number_phone VARCHAR(255) NOT NULL, country VARCHAR(255) NOT NULL, intra_community_vat VARCHAR(255) NOT NULL, number_siret VARCHAR(255) NOT NULL, last_update_date DATETIME DEFAULT NULL, region_criteria JSON NOT NULL, department_criteria JSON NOT NULL, INDEX IDX_C1EE637C89E04D0 (organization_type_id), UNIQUE INDEX UNIQ_C1EE637CF98F144A (logo_id), UNIQUE INDEX UNIQ_C1EE637C58EE93C7 (organization_visual_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE organization_link (id INT AUTO_INCREMENT NOT NULL, organization_id INT DEFAULT NULL, social_networks_id INT DEFAULT NULL, link VARCHAR(255) DEFAULT NULL, INDEX IDX_FA5A76C32C8A3DE (organization_id), INDEX IDX_FA5A76C15E9FC52 (social_networks_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE organization_type (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE participant_category (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE personal_statut (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE photographer_category (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE picture (id INT AUTO_INCREMENT NOT NULL, competition_id INT DEFAULT NULL, user_id INT DEFAULT NULL, file_id INT DEFAULT NULL, state TINYINT(1) NOT NULL, picture_name VARCHAR(255) NOT NULL, submission_date DATETIME NOT NULL, number_of_votes INT NOT NULL, price_won TINYINT(1) NOT NULL, price_rank INT NOT NULL, INDEX IDX_16DB4F897B39D312 (competition_id), INDEX IDX_16DB4F89A76ED395 (user_id), UNIQUE INDEX UNIQ_16DB4F8993CB796C (file_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE refresh_tokens (id INT AUTO_INCREMENT NOT NULL, refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid DATETIME NOT NULL, UNIQUE INDEX UNIQ_9BACE7E1C74F2195 (refresh_token), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE rent (id INT AUTO_INCREMENT NOT NULL, organization_id INT DEFAULT NULL, advertising_id INT DEFAULT NULL, start_date DATETIME NOT NULL, end_date DATETIME NOT NULL, url_click VARCHAR(255) NOT NULL, alt_tag VARCHAR(255) NOT NULL, price_sold INT NOT NULL, number_of_clicks INT NOT NULL, INDEX IDX_2784DCC32C8A3DE (organization_id), INDEX IDX_2784DCC9F084B42 (advertising_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE role (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE social_networks (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE sponsors (id INT AUTO_INCREMENT NOT NULL, organization_id INT DEFAULT NULL, competition_id INT DEFAULT NULL, start_date DATETIME NOT NULL, end_date DATETIME NOT NULL, sponsor_rank INT NOT NULL, price DOUBLE PRECISION NOT NULL, destination_url VARCHAR(255) DEFAULT NULL, INDEX IDX_9A31550F32C8A3DE (organization_id), INDEX IDX_9A31550F7B39D312 (competition_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE theme (id INT AUTO_INCREMENT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, gender_id INT DEFAULT NULL, photographer_category_id INT DEFAULT NULL, personal_statut_id INT DEFAULT NULL, picture_profil_id INT DEFAULT NULL, active TINYINT(1) NOT NULL, creation_date DATE NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, date_of_birth DATE NOT NULL, address VARCHAR(255) DEFAULT NULL, postcode VARCHAR(255) DEFAULT NULL, citycode VARCHAR(255) DEFAULT NULL, country VARCHAR(255) DEFAULT NULL, email VARCHAR(180) NOT NULL, phone_number VARCHAR(255) DEFAULT NULL, password VARCHAR(255) NOT NULL, registration_date DATETIME DEFAULT NULL, delete_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, last_connection_date DATETIME DEFAULT NULL, photographer_description VARCHAR(255) DEFAULT NULL, website_url VARCHAR(255) DEFAULT NULL, pseudonym VARCHAR(255) DEFAULT NULL, roles JSON NOT NULL, is_verified TINYINT(1) NOT NULL, region VARCHAR(255) DEFAULT NULL, department VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), INDEX IDX_8D93D649708A0E0 (gender_id), INDEX IDX_8D93D6495AB6392E (photographer_category_id), INDEX IDX_8D93D649F98CFEEE (personal_statut_id), UNIQUE INDEX UNIQ_8D93D6492E805CC6 (picture_profil_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_organization (user_id INT NOT NULL, organization_id INT NOT NULL, INDEX IDX_41221F7EA76ED395 (user_id), INDEX IDX_41221F7E32C8A3DE (organization_id), PRIMARY KEY(user_id, organization_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_notification_type (user_id INT NOT NULL, notification_type_id INT NOT NULL, INDEX IDX_CCFDA738A76ED395 (user_id), INDEX IDX_CCFDA738D0520624 (notification_type_id), PRIMARY KEY(user_id, notification_type_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_link (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, social_networks_id INT DEFAULT NULL, link VARCHAR(255) DEFAULT NULL, INDEX IDX_4C2DD538A76ED395 (user_id), INDEX IDX_4C2DD53815E9FC52 (social_networks_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE vote (id INT AUTO_INCREMENT NOT NULL, picture_id INT DEFAULT NULL, user_id INT DEFAULT NULL, vote_date DATETIME NOT NULL, INDEX IDX_5A108564EE45BDBF (picture_id), INDEX IDX_5A108564A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT FK_B50A2CB132C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id)');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT FK_B50A2CB1CB3905A3 FOREIGN KEY (competition_visual_id) REFERENCES file (id)');
        $this->addSql('ALTER TABLE competition_theme ADD CONSTRAINT FK_64C2D5DE7B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE competition_theme ADD CONSTRAINT FK_64C2D5DE59027487 FOREIGN KEY (theme_id) REFERENCES theme (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE competition_participant_category ADD CONSTRAINT FK_49222EDA7B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE competition_participant_category ADD CONSTRAINT FK_49222EDAE8756067 FOREIGN KEY (participant_category_id) REFERENCES participant_category (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE competition_notification_type ADD CONSTRAINT FK_343411DD7B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE competition_notification_type ADD CONSTRAINT FK_343411DDD0520624 FOREIGN KEY (notification_type_id) REFERENCES notification_type (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE member_of_the_jury ADD CONSTRAINT FK_40CC096B7B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id)');
        $this->addSql('ALTER TABLE member_of_the_jury ADD CONSTRAINT FK_40CC096BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE organization ADD CONSTRAINT FK_C1EE637C89E04D0 FOREIGN KEY (organization_type_id) REFERENCES organization_type (id)');
        $this->addSql('ALTER TABLE organization ADD CONSTRAINT FK_C1EE637CF98F144A FOREIGN KEY (logo_id) REFERENCES file (id)');
        $this->addSql('ALTER TABLE organization ADD CONSTRAINT FK_C1EE637C58EE93C7 FOREIGN KEY (organization_visual_id) REFERENCES file (id)');
        $this->addSql('ALTER TABLE organization_link ADD CONSTRAINT FK_FA5A76C32C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id)');
        $this->addSql('ALTER TABLE organization_link ADD CONSTRAINT FK_FA5A76C15E9FC52 FOREIGN KEY (social_networks_id) REFERENCES social_networks (id)');
        $this->addSql('ALTER TABLE picture ADD CONSTRAINT FK_16DB4F897B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id)');
        $this->addSql('ALTER TABLE picture ADD CONSTRAINT FK_16DB4F89A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE picture ADD CONSTRAINT FK_16DB4F8993CB796C FOREIGN KEY (file_id) REFERENCES file (id)');
        $this->addSql('ALTER TABLE rent ADD CONSTRAINT FK_2784DCC32C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id)');
        $this->addSql('ALTER TABLE rent ADD CONSTRAINT FK_2784DCC9F084B42 FOREIGN KEY (advertising_id) REFERENCES advertising_space (id)');
        $this->addSql('ALTER TABLE sponsors ADD CONSTRAINT FK_9A31550F32C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id)');
        $this->addSql('ALTER TABLE sponsors ADD CONSTRAINT FK_9A31550F7B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649708A0E0 FOREIGN KEY (gender_id) REFERENCES gender (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6495AB6392E FOREIGN KEY (photographer_category_id) REFERENCES photographer_category (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649F98CFEEE FOREIGN KEY (personal_statut_id) REFERENCES personal_statut (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6492E805CC6 FOREIGN KEY (picture_profil_id) REFERENCES file (id)');
        $this->addSql('ALTER TABLE user_organization ADD CONSTRAINT FK_41221F7EA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_organization ADD CONSTRAINT FK_41221F7E32C8A3DE FOREIGN KEY (organization_id) REFERENCES organization (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_notification_type ADD CONSTRAINT FK_CCFDA738A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_notification_type ADD CONSTRAINT FK_CCFDA738D0520624 FOREIGN KEY (notification_type_id) REFERENCES notification_type (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_link ADD CONSTRAINT FK_4C2DD538A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user_link ADD CONSTRAINT FK_4C2DD53815E9FC52 FOREIGN KEY (social_networks_id) REFERENCES social_networks (id)');
        $this->addSql('ALTER TABLE vote ADD CONSTRAINT FK_5A108564EE45BDBF FOREIGN KEY (picture_id) REFERENCES picture (id)');
        $this->addSql('ALTER TABLE vote ADD CONSTRAINT FK_5A108564A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE competition DROP FOREIGN KEY FK_B50A2CB132C8A3DE');
        $this->addSql('ALTER TABLE competition DROP FOREIGN KEY FK_B50A2CB1CB3905A3');
        $this->addSql('ALTER TABLE competition_theme DROP FOREIGN KEY FK_64C2D5DE7B39D312');
        $this->addSql('ALTER TABLE competition_theme DROP FOREIGN KEY FK_64C2D5DE59027487');
        $this->addSql('ALTER TABLE competition_participant_category DROP FOREIGN KEY FK_49222EDA7B39D312');
        $this->addSql('ALTER TABLE competition_participant_category DROP FOREIGN KEY FK_49222EDAE8756067');
        $this->addSql('ALTER TABLE competition_notification_type DROP FOREIGN KEY FK_343411DD7B39D312');
        $this->addSql('ALTER TABLE competition_notification_type DROP FOREIGN KEY FK_343411DDD0520624');
        $this->addSql('ALTER TABLE member_of_the_jury DROP FOREIGN KEY FK_40CC096B7B39D312');
        $this->addSql('ALTER TABLE member_of_the_jury DROP FOREIGN KEY FK_40CC096BA76ED395');
        $this->addSql('ALTER TABLE organization DROP FOREIGN KEY FK_C1EE637C89E04D0');
        $this->addSql('ALTER TABLE organization DROP FOREIGN KEY FK_C1EE637CF98F144A');
        $this->addSql('ALTER TABLE organization DROP FOREIGN KEY FK_C1EE637C58EE93C7');
        $this->addSql('ALTER TABLE organization_link DROP FOREIGN KEY FK_FA5A76C32C8A3DE');
        $this->addSql('ALTER TABLE organization_link DROP FOREIGN KEY FK_FA5A76C15E9FC52');
        $this->addSql('ALTER TABLE picture DROP FOREIGN KEY FK_16DB4F897B39D312');
        $this->addSql('ALTER TABLE picture DROP FOREIGN KEY FK_16DB4F89A76ED395');
        $this->addSql('ALTER TABLE picture DROP FOREIGN KEY FK_16DB4F8993CB796C');
        $this->addSql('ALTER TABLE rent DROP FOREIGN KEY FK_2784DCC32C8A3DE');
        $this->addSql('ALTER TABLE rent DROP FOREIGN KEY FK_2784DCC9F084B42');
        $this->addSql('ALTER TABLE sponsors DROP FOREIGN KEY FK_9A31550F32C8A3DE');
        $this->addSql('ALTER TABLE sponsors DROP FOREIGN KEY FK_9A31550F7B39D312');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649708A0E0');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D6495AB6392E');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649F98CFEEE');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D6492E805CC6');
        $this->addSql('ALTER TABLE user_organization DROP FOREIGN KEY FK_41221F7EA76ED395');
        $this->addSql('ALTER TABLE user_organization DROP FOREIGN KEY FK_41221F7E32C8A3DE');
        $this->addSql('ALTER TABLE user_notification_type DROP FOREIGN KEY FK_CCFDA738A76ED395');
        $this->addSql('ALTER TABLE user_notification_type DROP FOREIGN KEY FK_CCFDA738D0520624');
        $this->addSql('ALTER TABLE user_link DROP FOREIGN KEY FK_4C2DD538A76ED395');
        $this->addSql('ALTER TABLE user_link DROP FOREIGN KEY FK_4C2DD53815E9FC52');
        $this->addSql('ALTER TABLE vote DROP FOREIGN KEY FK_5A108564EE45BDBF');
        $this->addSql('ALTER TABLE vote DROP FOREIGN KEY FK_5A108564A76ED395');
        $this->addSql('DROP TABLE advertising_space');
        $this->addSql('DROP TABLE competition');
        $this->addSql('DROP TABLE competition_theme');
        $this->addSql('DROP TABLE competition_participant_category');
        $this->addSql('DROP TABLE competition_notification_type');
        $this->addSql('DROP TABLE file');
        $this->addSql('DROP TABLE gender');
        $this->addSql('DROP TABLE member_of_the_jury');
        $this->addSql('DROP TABLE notification_type');
        $this->addSql('DROP TABLE organization');
        $this->addSql('DROP TABLE organization_link');
        $this->addSql('DROP TABLE organization_type');
        $this->addSql('DROP TABLE participant_category');
        $this->addSql('DROP TABLE personal_statut');
        $this->addSql('DROP TABLE photographer_category');
        $this->addSql('DROP TABLE picture');
        $this->addSql('DROP TABLE refresh_tokens');
        $this->addSql('DROP TABLE rent');
        $this->addSql('DROP TABLE role');
        $this->addSql('DROP TABLE social_networks');
        $this->addSql('DROP TABLE sponsors');
        $this->addSql('DROP TABLE theme');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE user_organization');
        $this->addSql('DROP TABLE user_notification_type');
        $this->addSql('DROP TABLE user_link');
        $this->addSql('DROP TABLE vote');
    }
}
