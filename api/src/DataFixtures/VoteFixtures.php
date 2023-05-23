<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Vote;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class VoteFixtures extends Fixture implements DependentFixtureInterface
{

    const VOTE_COUNT_REFERENCE = PictureFixtures::PICTURE_COUNT_REFERENCE * 3;

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < self::VOTE_COUNT_REFERENCE; $i++) {
            $vote = new Vote();

            $vote->setVoteDate($faker->dateTime());
            $vote->setUser($this->getReference(UserFixtures::USER_REFERENCE . rand(1, UserFixtures::USER_COUNT_REFERENCE)));
            $vote->setPicture($this->getReference(PictureFixtures::PICTURE_REFERENCE . rand(1, PictureFixtures::PICTURE_COUNT_REFERENCE)));

            $manager->persist($vote);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
            PictureFixtures::class,
        ];
    }
}
