<?php

namespace App\DataFixtures;

use App\Entity\Competition;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class CompetitionFixtures extends Fixture implements DependentFixtureInterface
{

    const COMPETITION_REFERENCE = 'competition';
    const COMPETITION_COUNT_REFERENCE = 10;
    const COUNT_REFERENCE = 100;

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < self::COMPETITION_COUNT_REFERENCE; $i++) {
            $competition = new Competition();

            $competition->setState($faker->boolean());
            $competition->setCompetitionName($faker->text());
            $competition->setCompetitionVisual($faker->imageUrl());
            $competition->setDescription($faker->text());
            $competition->setRules($faker->text());
            $competition->setEndowments($faker->text());
            $competition->setCreationDate($faker->dateTime());
            $competition->setPublicationDate($faker->dateTime());
            $competition->setPublicationStartDate($faker->dateTime());
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
            $competition->setCityCriteria([$faker->city()]);
            $competition->setRegionCriteria([$faker->region()]);
            $competition->setDepartmentCriteria([$faker->departmentName()]);
            $competition->setOrganization($this->getReference(OrganizationFixtures::ORGANIZATION_REFERENCE . rand(1, self::COMPETITION_COUNT_REFERENCE)));

            $manager->persist($competition);

            $this->addReference(sprintf('%s%d', self::COMPETITION_REFERENCE, $i + 1), $competition);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            OrganizationFixtures::class,
        ];
    }
}
