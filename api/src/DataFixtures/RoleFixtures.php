<?php

namespace App\DataFixtures;

use App\Entity\Gender;
use App\Entity\Role;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class RoleFixtures extends Fixture
{
    const ROLE_ARRAY = [
        'ROLE_PHOTOGRAPHER',
        'ROLE_ORGANIZER',
        'ROLE_JURY',
        'ROLE_ADMIN',
    ];

    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i <= count(self::ROLE_ARRAY) - 1; $i++) {
            $role = new Role();
            $role->setLabel(self::ROLE_ARRAY[$i]);
            $manager->persist($role);
        }

        $manager->flush();
    }
}
