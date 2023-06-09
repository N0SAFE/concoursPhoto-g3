<?php

namespace App\Repository;

use App\Entity\ParticipantCategory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ParticipantCategory>
 *
 * @method ParticipantCategory|null find($id, $lockMode = null, $lockVersion = null)
 * @method ParticipantCategory|null findOneBy(array $criteria, array $orderBy = null)
 * @method ParticipantCategory[]    findAll()
 * @method ParticipantCategory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ParticipantCategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ParticipantCategory::class);
    }

    public function save(ParticipantCategory $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(
        ParticipantCategory $entity,
        bool $flush = false
    ): void {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    //    /**
    //     * @return ParticipantCategory[] Returns an array of ParticipantCategory objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?ParticipantCategory
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
