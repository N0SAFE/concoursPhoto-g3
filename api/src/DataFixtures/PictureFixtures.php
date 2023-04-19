<?php

namespace App\DataFixtures;

use App\Entity\File;
use App\Entity\Picture;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Filesystem\Filesystem;

class PictureFixtures extends Fixture implements DependentFixtureInterface
{
    public function __construct(private Filesystem $filesystem)
    {
        $this->faker = Factory::create('fr_FR');
    }

    const PICTURE_ARRAY = [
        "698-2160-2160.jpg",
        "814-2160-2160.jpg",
        "904-2160-2160.jpg",
        "952-2160-2160.jpg",
        "12839c32a07ad619a08ccaec9d21c241b732d40d.Capture d'écran 2023-03-22 154847.png"
    ];

    const PICTURE_REFERENCE = 'picture';
    const PICTURE_COUNT_REFERENCE = 500;

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

        for ($i = 0; $i < self::PICTURE_COUNT_REFERENCE; $i++) {
            $picture = new Picture();

            $picture->setState($faker->boolean());
            $picture->setPictureName($faker->text());
            $picture->setSubmissionDate($faker->dateTime());
            $picture->setFile($this->createFile());
            $picture->setNumberOfVotes(random_int(0, 100));
            $picture->setPriceWon($faker->randomFloat(3, 0, 100));
            $picture->setPriceRank(random_int(0, 100));
            $picture->setCompetition($this->getReference(CompetitionFixtures::COMPETITION_REFERENCE . rand(1, CompetitionFixtures::COMPETITION_COUNT_REFERENCE)));
            $picture->setUser($this->getReference(UserFixtures::USER_REFERENCE . rand(1, UserFixtures::USER_COUNT_REFERENCE)));

            $manager->persist($picture);

            $this->addReference(sprintf('%s%d', self::PICTURE_REFERENCE, $i + 1), $picture);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            CompetitionFixtures::class,
            UserFixtures::class
        ];
    }
}
