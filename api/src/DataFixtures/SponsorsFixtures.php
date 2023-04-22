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
    const SPONSORS_COUNT_REFERENCE = 10;
    const COUNT_REFERENCE = 1000;

    private $faker;

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
        $faker = Factory::create('fr_FR');

        for ($i = 1; $i < self::SPONSORS_COUNT_REFERENCE; $i++) {
            $sponsors = new Sponsors();

            $sponsors->setStartDate($faker->dateTime());
            $sponsors->setEndDate($faker->dateTime());
            $sponsors->setSponsorRank($faker->randomDigit());
            $sponsors->setOrganization($this->getReference(OrganizationFixtures::ORGANIZATION_REFERENCE . rand(1, self::SPONSORS_COUNT_REFERENCE)));
            $sponsors->setCompetition($this->getReference(CompetitionFixtures::COMPETITION_REFERENCE . rand(1, self::SPONSORS_COUNT_REFERENCE)));
            $sponsors->setPrice($faker->randomFloat(3, 0, self::COUNT_REFERENCE));
            $sponsors->setLogo($this->createFile());

            $manager->persist($sponsors);
        }

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
