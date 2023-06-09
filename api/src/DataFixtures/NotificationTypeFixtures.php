<?php

namespace App\DataFixtures;

use App\Entity\NotificationType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class NotificationTypeFixtures extends Fixture
{
    const NOTIFICATION_TYPE_REFERENCE = 'notification_type';
    const NOTIFICATION_TYPE_ARRAY = [
        ['Être informé par email lorsqu’un nouveau concours est publié', 1],
        ['Être informé par email lorsqu’un concours entre en phase de vote', 2],
        [
            'Être informé par email 48h avant la date de fin des votes d’un concours',
            3,
        ],
        [
            'Être informé par email lorsque les résultats d’un concours sont publiés',
            4,
        ],
        [
            'Être informé par email lorsqu’une nouvel article/actualité est publiée dans le blog',
            5,
        ],
        [
            'Être informé lorsqu’un nouveau concours est publié et que mon profil satisfait les critères de participation',
            6,
        ],
        ['Être informé lorsqu’un concours entre en phase de soumission', 7],
        [
            'Être informé 48h avant la date de fin des soumissions d’un concours',
            8,
        ],
    ];

    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i <= count(self::NOTIFICATION_TYPE_ARRAY) - 1; $i++) {
            $notification_type = new NotificationType();
            $notification_type->setLabel(self::NOTIFICATION_TYPE_ARRAY[$i][0]);
            $notification_type->setNotificationCode(
                self::NOTIFICATION_TYPE_ARRAY[$i][1]
            );
            $manager->persist($notification_type);
            $this->addReference(
                sprintf(
                    '%s%d',
                    self::NOTIFICATION_TYPE_REFERENCE,
                    self::NOTIFICATION_TYPE_ARRAY[$i][1]
                ),
                $notification_type
            );
        }

        $manager->flush();
    }
}
