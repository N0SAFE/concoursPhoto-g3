<?php

namespace App\DataFixtures;

use App\Entity\UserLink;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class UserLinkFixtures extends Fixture implements DependentFixtureInterface
{
    const USER_LINK_COUNT_REFERENCE = 6;

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < self::USER_LINK_COUNT_REFERENCE; $i++) {
            $link = new UserLink();

            $link->setLink($faker->url);
            $link->setSocialnetworks($this->getReference(SocialNetworksFixtures::SN_REFERENCE . rand(1, self::USER_LINK_COUNT_REFERENCE)));
            $link->setUser($this->getReference(UserFixtures::USER_REFERENCE . rand(1, self::USER_LINK_COUNT_REFERENCE)));

            $manager->persist($link);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            SocialNetworksFixtures::class,
            UserFixtures::class
        ];
    }
}
