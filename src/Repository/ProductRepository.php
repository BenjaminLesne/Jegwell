<?php

namespace App\Repository;

use App\Entity\Product;
use App\Entity\ProductSearch;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Product>
 *
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function save(Product $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Product $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findAllQuery(ProductSearch $search)
    {
        $query = $this->createQueryBuilder('product');
        $categorySearched = $search->getCategory();
        $sortWanted = $search->getSort();

        if ($categorySearched) {
            $query->andWhere(':category MEMBER OF product.categories')
                ->setParameter('category', $categorySearched);
        }

        if ($sortWanted) {
            switch ($sortWanted) {
                case 'name DESC':
                    $query->orderBy('product.name', 'DESC');
                    break;
                case 'price ASC':
                    $query->leftJoin('product.options', 'option')
                        ->addSelect('option')
                        ->orderBy('option.price', 'ASC');
                    break;
                case 'price DESC':
                    $query->leftJoin('product.options', 'option')
                        ->addSelect('option')
                        ->orderBy('option.price', 'DESC');
                    break;
                default:
                case 'name ASC':
                    $query->orderBy('product.name', 'ASC');
                    break;
            }
        }

        return $query->getQuery();
    }
    //    /**
    //     * @return Product[] Returns an array of Product objects
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

    //    public function findOneBySomeField($value): ?Product
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
