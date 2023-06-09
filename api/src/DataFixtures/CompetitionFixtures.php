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
    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    const COMPETITION_REFERENCE = 'competition';
    const COMPETITION_COUNT_REFERENCE = 60;
    const MAX_WEIGHTING_OF_JURY_VOTES = 100;
    const MAX_NUMBER_OF_MAX_VOTES = 10;
    const MAX_NUMBER_OF_PRICES = 20;
    const MIN_AGE_CRITERIA = 6;
    const MAX_AGE_CRITERIA = 99;

    const CITY_ARRAY = [
        '60341',
        '01032',
        '46201',
        '24008',
        '02347',
        '06055',
        '34343',
        '66025',
        '80829',
        '51578',
    ];

    const DEPARTMENT_ARRAY = [
        '976',
        '45',
        '14',
        '15',
        '28',
        '47',
        '04',
        '83',
        '973',
        '68',
    ];

    const REGION_ARRAY = [
        '32',
        '11',
        '24',
        '27',
        '28',
        '44',
        '52',
        '53',
        '02',
        '04',
    ];

    const ENDOWMENTS_ARRAY = [
        'Cadeaux',
        'Prix',
        'Récompenses',
        'Lots',
        'Bons d\'achat',
        'Bons cadeaux',
        'Chèques cadeaux',
        'Chèques',
    ];

    public function getRandomElements(array $array, int $count): string
    {
        shuffle($array);
        $randomElements = array_slice($array, 0, $count);
        return $randomElements[0];
    }

    public function load(ObjectManager $manager): void
    {
        $faker = $this->faker;

        for ($i = 0; $i < self::COMPETITION_COUNT_REFERENCE; $i++) {
            $competition = new Competition();

            $minAge = random_int(
                self::MIN_AGE_CRITERIA,
                self::MAX_AGE_CRITERIA
            );
            $maxAge = random_int($minAge, self::MAX_AGE_CRITERIA);

            $resultsDate = $faker->dateTimeBetween('-1 year', '+1 year');
            $votingEndDate = $faker->dateTimeBetween('-1 year', $resultsDate);
            $votingStartDate = $faker->dateTimeBetween(
                '-1 year',
                $votingEndDate
            );
            $submissionEndDate = $faker->dateTimeBetween(
                '-1 year',
                $votingStartDate
            );
            $submissionStartDate = $faker->dateTimeBetween(
                '-1 year',
                $submissionEndDate
            );
            $publicationDate = $faker->dateTimeBetween(
                '-1 year',
                $submissionStartDate
            );
            $creationDate = $faker->dateTimeBetween(
                '-1 year',
                $publicationDate
            );

            $competition->setCompetitionName($faker->text());
            $competition->setCompetitionVisual(
                (new FileFixtures())->createFileFromArray(
                    FileFixtures::COMPETITION_LOGO_ARRAY
                )
            );
            $competition->setDescription($faker->text());
            $competition->setRules($faker->text());
            $competition->setEndowments(
                $this->getRandomElements(self::ENDOWMENTS_ARRAY, 1)
            );
            $competition->setCreationDate($creationDate);
            $competition->setPublicationDate($publicationDate);
            $competition->setSubmissionStartDate($submissionStartDate);
            $competition->setSubmissionEndDate($submissionEndDate);
            $competition->setVotingStartDate($votingStartDate);
            $competition->setVotingEndDate($votingEndDate);
            $competition->setResultsDate($resultsDate);
            $competition->setWeightingOfJuryVotes(
                $faker->randomFloat(3, 0, self::MAX_WEIGHTING_OF_JURY_VOTES)
            );
            $competition->setNumberOfMaxVotes(
                random_int(0, self::MAX_NUMBER_OF_MAX_VOTES)
            );
            $competition->setNumberOfPrices(
                random_int(0, self::MAX_NUMBER_OF_PRICES)
            );
            $competition->setMinAgeCriteria($minAge);
            $competition->setMaxAgeCriteria($maxAge);
            $competition->setCountryCriteria(['FRANCE']);
            $competition->setIsPromoted($faker->boolean());
            $competition->setConsultationCount(0);

            $cities = [];
            $cityNumber = rand(1, 3);
            while (count($cities) < $cityNumber) {
                if (
                    !in_array(
                        self::CITY_ARRAY[rand(0, count(self::CITY_ARRAY) - 1)],
                        $cities
                    )
                ) {
                    $cities[] =
                        self::CITY_ARRAY[rand(0, count(self::CITY_ARRAY) - 1)];
                }
            }
            $competition->setCityCriteria($cities);

            $regions = [];
            $regionNumber = rand(1, 3);
            while (count($regions) < $regionNumber) {
                if (
                    !in_array(
                        self::REGION_ARRAY[
                            rand(0, count(self::REGION_ARRAY) - 1)
                        ],
                        $regions
                    )
                ) {
                    $regions[] =
                        self::REGION_ARRAY[
                            rand(0, count(self::REGION_ARRAY) - 1)
                        ];
                }
            }
            $competition->setRegionCriteria($regions);

            $departments = [];
            $departmentNumber = rand(1, 3);
            while (count($departments) < $departmentNumber) {
                if (
                    !in_array(
                        self::DEPARTMENT_ARRAY[
                            rand(0, count(self::DEPARTMENT_ARRAY) - 1)
                        ],
                        $departments
                    )
                ) {
                    $departments[] =
                        self::DEPARTMENT_ARRAY[
                            rand(0, count(self::DEPARTMENT_ARRAY) - 1)
                        ];
                }
            }
            $competition->setDepartmentCriteria($departments);

            $competition->setOrganization(
                $this->getReference(
                    OrganizationFixtures::ORGANIZATION_REFERENCE .
                        rand(
                            1,
                            OrganizationFixtures::ORGANIZATION_COUNT_REFERENCE
                        )
                )
            );
            $competition->addParticipantCategory(
                $this->getReference(
                    ParticipantCategoryFixtures::PARTICIPANT_CATEGORY_REFERENCE .
                        rand(
                            1,
                            count(
                                ParticipantCategoryFixtures::PARTICIPANT_CATEGORY_ARRAY
                            )
                        )
                )
            );

            for ($j = 0; $j < rand(1, 3); $j++) {
                $competition->addTheme(
                    $this->getReference(
                        ThemeFixtures::THEME_REFERENCE .
                            rand(1, count(ThemeFixtures::THEME_ARRAY))
                    )
                );
            }

            for ($j = 0; $j < rand(1, 3); $j++) {
                $competition->addSponsor(
                    $this->getReference(
                        SponsorsFixtures::SPONSORS_REFERENCE .
                            rand(1, SponsorsFixtures::SPONSORS_COUNT_REFERENCE)
                    )
                );
            }

            $manager->persist($competition);

            $this->addReference(
                sprintf('%s%d', self::COMPETITION_REFERENCE, $i + 1),
                $competition
            );
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            OrganizationFixtures::class,
            ParticipantCategoryFixtures::class,
            ThemeFixtures::class,
            SponsorsFixtures::class,
        ];
    }
}
