<?php

namespace App\DataFixtures;

use App\Entity\OrganizationType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class OrganizationTypeFixtures extends Fixture
{
    const ORGANIZATION_TYPE_REFERENCE = 'organization_type';
    const ORGANIZATION_TYPE_ARRAY = [
        'Mairie',
        'Association',
        'Entreprise',
        'Autre',
    ];

    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i <= count(self::ORGANIZATION_TYPE_ARRAY) - 1; $i++) {
            $organization_type = new OrganizationType();
            $organization_type->setLabel(self::ORGANIZATION_TYPE_ARRAY[$i]);
            $manager->persist($organization_type);
            $this->addReference(
                sprintf('%s%d', self::ORGANIZATION_TYPE_REFERENCE, $i + 1),
                $organization_type
            );
        }

        $manager->flush();
    }
}
