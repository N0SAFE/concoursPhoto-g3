<?php

namespace App\DataFixtures;

use App\Entity\Competition;
use App\Entity\File;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class CompetitionFixtures extends Fixture implements DependentFixtureInterface
{
    public function __construct(){
        $this->faker = Factory::create('fr_FR');
    }

    const PICTURE_ARRAY = [
        "698-2160-2160.jpg",
        "814-2160-2160.jpg",
        "904-2160-2160.jpg",
        "952-2160-2160.jpg",
        "12839c32a07ad619a08ccaec9d21c241b732d40d.Capture d'écran 2023-03-22 154847.png"
    ];

    const COMPETITION_REFERENCE = 'competition';
    const COMPETITION_COUNT_REFERENCE = 10;
    const COUNT_REFERENCE = 100;

    const CITY_ARRAY = [
        '60341', '01032', '46201', '24008', '02347', '06055', '34343', '66025', '80829', '51578',
    ];

    const DEPARTMENT_ARRAY = [
        '976', '45', '14', '15', '28', '47', '04', '83', '973', '68'
    ];

    const REGION_ARRAY = [
        '32', '11', '24', '27', '28', '44', '52', '53', '02', '04'
    ];

    public function createFile() {
        $file = new File();

        $file->setExtension($this->faker->fileExtension());
        $file->setPath("fixtures-upload/" . self::PICTURE_ARRAY[rand(0, count(self::PICTURE_ARRAY) - 1)]);
        $file->setSize($this->faker->randomNumber());
        $file->setType($this->faker->mimeType());
        $file->setDefaultName($this->faker->name());

        return $file;
    }

    public function load(ObjectManager $manager): void
    {

        $faker = $this->faker;

        for ($i = 0; $i < self::COMPETITION_COUNT_REFERENCE; $i++) {
            $competition = new Competition();

            $competition->setState($faker->boolean());
            $competition->setCompetitionName($faker->text());
            $competition->setCompetitionVisual($this->createFile());
            $competition->setDescription($faker->text());
            $competition->setRules($faker->text());
            $competition->setEndowments($faker->text());
            $competition->setCreationDate($faker->dateTime());
            $competition->setPublicationDate($faker->dateTime());
            $competition->setSubmissionStartDate($faker->dateTime());
            $competition->setSubmissionEndDate($faker->dateTime());
            $competition->setVotingStartDate($faker->dateTime());
            $competition->setVotingEndDate($faker->dateTime());
            $competition->setResultsDate($faker->dateTime());
            $competition->setWeightingOfJuryVotes($faker->randomFloat(3, 0, self::COUNT_REFERENCE));
            $competition->setNumberOfMaxVotes(random_int(0, self::COUNT_REFERENCE));
            $competition->setNumberOfPrices(random_int(0, self::COUNT_REFERENCE));
            $competition->setMinAgeCriteria(random_int(0, self::COUNT_REFERENCE));
            $competition->setMaxAgeCriteria(random_int(0, self::COUNT_REFERENCE));
            $competition->setCountryCriteria(["FRANCE"]);

            $cities = [];
            $cityNumber = rand(1, 3);
            while (count($cities) < $cityNumber) {
                if (!in_array(self::CITY_ARRAY[rand(0, count(self::CITY_ARRAY) - 1)], $cities)) {
                    $cities[] = self::CITY_ARRAY[rand(0, count(self::CITY_ARRAY) - 1)];
                }
            }
            $competition->setCityCriteria($cities);

            $regions = [];
            $regionNumber = rand(1, 3);
            while (count($regions) < $regionNumber) {
                if (!in_array(self::REGION_ARRAY[rand(0, count(self::REGION_ARRAY) - 1)], $regions)) {
                    $regions[] = self::REGION_ARRAY[rand(0, count(self::REGION_ARRAY) - 1)];
                }
            }
            $competition->setRegionCriteria($regions);

            $departments = [];
            $departmentNumber = rand(1, 3);
            while (count($departments) < $departmentNumber) {
                if (!in_array(self::DEPARTMENT_ARRAY[rand(0, count(self::DEPARTMENT_ARRAY) - 1)], $departments)) {
                    $departments[] = self::DEPARTMENT_ARRAY[rand(0, count(self::DEPARTMENT_ARRAY) - 1)];
                }
            }
            $competition->setDepartmentCriteria($departments);

            $competition->setOrganization($this->getReference(OrganizationFixtures::ORGANIZATION_REFERENCE . rand(1, OrganizationFixtures::ORGANIZATION_COUNT_REFERENCE)));
            $competition->addParticipantCategory($this->getReference(ParticipantCategoryFixtures::PARTICIPANT_CATEGORY_REFERENCE . rand(1, count(ParticipantCategoryFixtures::PARTICIPANT_CATEGORY_ARRAY))));
            $competition->addTheme($this->getReference(ThemeFixtures::THEME_REFERENCE . rand(1, count(ThemeFixtures::THEME_ARRAY))));

            $manager->persist($competition);

            $this->addReference(sprintf('%s%d', self::COMPETITION_REFERENCE, $i + 1), $competition);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            OrganizationFixtures::class,
            ParticipantCategoryFixtures::class,
            ThemeFixtures::class
        ];
    }
}
