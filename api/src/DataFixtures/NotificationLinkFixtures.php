<?php

namespace App\DataFixtures;

use App\Entity\NotificationLink;
use App\Entity\NotificationType;
use App\Entity\UserLink;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class NotificationLinkFixtures extends Fixture implements DependentFixtureInterface
{
    const NOTIFICATION_LINK_COUNT_REFERENCE = 8;

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($i = 0; $i < self::NOTIFICATION_LINK_COUNT_REFERENCE; $i++) {
            $notification_link = new NotificationLink();

            $notification_link->setState($faker->boolean());
            $notification_link->setUser($this->getReference(UserFixtures::USER_REFERENCE . rand(1, self::NOTIFICATION_LINK_COUNT_REFERENCE)));
            $notification_link->setNotification($this->getReference(NotificationTypeFixtures::NOTIFICATION_TYPE_REFERENCE . rand(1, self::NOTIFICATION_LINK_COUNT_REFERENCE)));

            $manager->persist($notification_link);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            NotificationTypeFixtures::class,
            UserFixtures::class
        ];
    }
}
