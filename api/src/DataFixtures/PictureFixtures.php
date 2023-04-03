<?php

namespace App\DataFixtures;

use App\Entity\Picture;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class PictureFixtures extends Fixture implements DependentFixtureInterface
{
    const PICTURE_REFERENCE = 'picture';
    const PICTURE_COUNT_REFERENCE = 10;
    const COUNT_REFERENCE = 100;

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < self::PICTURE_COUNT_REFERENCE; $i++) {
            $picture = new Picture();

            $picture->setState($faker->boolean());
            $picture->setPictureName($faker->text());
            $picture->setSubmissionDate($faker->dateTime());
            $picture->setFile($faker->imageUrl());
            $picture->setNumberOfVotes(random_int(0, self::COUNT_REFERENCE));
            $picture->setPriceWon($faker->randomFloat(3, 0, self::COUNT_REFERENCE));
            $picture->setPriceRank(random_int(0, self::COUNT_REFERENCE));
            $picture->setCompetition($this->getReference(CompetitionFixtures::COMPETITION_REFERENCE . rand(1, self::PICTURE_COUNT_REFERENCE)));
            $picture->setUser($this->getReference(UserFixtures::USER_REFERENCE . rand(1, self::PICTURE_COUNT_REFERENCE)));

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
