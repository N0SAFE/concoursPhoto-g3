<?php

namespace App\DataFixtures;

use App\Entity\Sponsors;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class SponsorsFixtures extends Fixture implements DependentFixtureInterface
{
    const SPONSORS_REFERENCE = 'sponsors';
    const SPONSORS_COUNT_REFERENCE = CompetitionFixtures::COMPETITION_COUNT_REFERENCE * 3;
    const COUNT_REFERENCE = 1000;

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < self::SPONSORS_COUNT_REFERENCE; $i++) {
            $sponsors = new Sponsors();

            $sponsors->setStartDate($faker->dateTime());
            $sponsors->setEndDate($faker->dateTime());
            $sponsors->setSponsorRank($faker->randomDigit());
            $sponsors->setOrganization(
                $this->getReference(sprintf('%s%d', OrganizationFixtures::ORGANIZATION_REFERENCE, rand(1, OrganizationFixtures::ORGANIZATION_COUNT_REFERENCE))));
            $sponsors->setCompetition(
                $this->getReference(sprintf('%s%d', CompetitionFixtures::COMPETITION_REFERENCE, rand(1, CompetitionFixtures::COMPETITION_COUNT_REFERENCE))));
            $sponsors->setPrice(
                $faker->randomFloat(3, 0, self::COUNT_REFERENCE)
            );
            $sponsors->setDestinationUrl(
                $faker->url()
            );

            $manager->persist($sponsors);

            $this->addReference(
                sprintf('%s%d', self::SPONSORS_REFERENCE, $i + 1),
                $sponsors
            );
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [OrganizationFixtures::class, CompetitionFixtures::class];
    }
}
