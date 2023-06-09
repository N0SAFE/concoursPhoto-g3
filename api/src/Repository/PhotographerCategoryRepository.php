<?php

namespace App\Repository;

use App\Entity\PhotographerCategory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PhotographerCategory>
 *
 * @method PhotographerCategory|null find($id, $lockMode = null, $lockVersion = null)
 * @method PhotographerCategory|null findOneBy(array $criteria, array $orderBy = null)
 * @method PhotographerCategory[]    findAll()
 * @method PhotographerCategory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PhotographerCategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PhotographerCategory::class);
    }

    public function save(
        PhotographerCategory $entity,
        bool $flush = false
    ): void {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(
        PhotographerCategory $entity,
        bool $flush = false
    ): void {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    //    /**
    //     * @return PhotographerCategory[] Returns an array of PhotographerCategory objects
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

    //    public function findOneBySomeField($value): ?PhotographerCategory
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
