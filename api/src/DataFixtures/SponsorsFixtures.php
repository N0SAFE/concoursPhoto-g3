<?php

namespace App\DataFixtures;

use App\Entity\Sponsors;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class SponsorsFixtures extends Fixture implements DependentFixtureInterface
{
    const SPONSORS_COUNT_REFERENCE = 10;
    const COUNT_REFERENCE = 1000;

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        $sponsors = new Sponsors();

        $sponsors->setStartDate($faker->dateTime());
        $sponsors->setEndDate($faker->dateTime());
        $sponsors->setSponsorRank($faker->randomDigit());
        $sponsors->setOrganization($this->getReference(OrganizationFixtures::ORGANIZATION_REFERENCE . rand(1, self::SPONSORS_COUNT_REFERENCE)));
        $sponsors->setCompetition($this->getReference(CompetitionFixtures::COMPETITION_REFERENCE . rand(1, self::SPONSORS_COUNT_REFERENCE)));
        $sponsors->setPrice($faker->randomFloat(3, 0, self::COUNT_REFERENCE));

        $manager->persist($sponsors);

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            CompetitionFixtures::class,
            OrganizationFixtures::class
        ];
    }
}
