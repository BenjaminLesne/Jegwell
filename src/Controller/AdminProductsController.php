<?php

namespace App\Controller;

use App\Constants\Routes;
use App\Entity\Category;
use App\Entity\Product;
use App\Form\CategoryType;
use App\Form\ProductType;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminProductsController extends AbstractController
{
    private $repository;
    private $em;

    public function __construct(ProductRepository $repository, EntityManagerInterface $em)
    {
        $this->repository = $repository;
        $this->em = $em;
    }

    #[Route('/admin/produits', name: Routes::ADMIN_PRODUCT)]
    public function index(Request $request): Response
    {
        // $products = $this->repository->findAll();

        $productForm = $this->createForm(ProductType::class);
        $categoryForm = $this->createForm(CategoryType::class);
        $categoryForm->handleRequest($request);
        if ($categoryForm->isSubmitted() && $categoryForm->isValid()) {
            $newCategory = $categoryForm->getData();
            $this->em->persist($newCategory);
            //  dd($data);
//             $newCategory = new Category();
//             $newCategory
//             ->setImageName('test')
//             ->setName($data->name)
//             ->setImageFile($data->imageFile);
            $this->em->flush();
        }

        return $this->render('admin_products/index.html.twig', [
            'controller_name' => 'AdminProductController',
            // 'products' => $products,
            // 'productForm' => $productForm->createView(),
            'categoryForm' => $categoryForm->createView(),
        ]);
    }

    #[Route('/admin/produits/{id}', name: Routes::ADMIN_PRODUCT_EDIT)]
    public function edit(Product $product): Response
    {
        $form = $this->createForm(ProductType::class, $product);

        return $this->render('admin_products/edit.html.twig', [
            'products' => $product,
            'form' => $form->createView(),
        ]);
    }
}
