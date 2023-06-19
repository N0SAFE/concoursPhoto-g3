<?php

namespace App\DataFixtures;

use App\Entity\File;
use App\Entity\Sponsors;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class SponsorsFixtures extends Fixture implements DependentFixtureInterface
{
    const SPONSORS_REFERENCE = 'sponsors';
    const SPONSORS_COUNT_REFERENCE = FileFixtures::SPONSOR_LOGO_ARRAY_COUNT;
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
            $sponsors->setSponsorName($faker->name());
            $sponsors->setSponsorRank($faker->randomDigit());
            $sponsors->setOrganization(
                $this->getReference(
                    OrganizationFixtures::ORGANIZATION_REFERENCE .
                        rand(1, self::SPONSORS_COUNT_REFERENCE)
                )
            );
            $sponsors->setPrice(
                $faker->randomFloat(3, 0, self::COUNT_REFERENCE)
            );
            $sponsors->setLogo(
                (new FileFixtures())->createFileFromString(
                    FileFixtures::SPONSOR_LOGO_ARRAY[$i]
                )
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
        return [OrganizationFixtures::class];
    }
}
