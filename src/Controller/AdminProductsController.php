<?php

namespace App\Controller;

use App\Constants\Routes;
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
        $products = $this->repository->findAll();

        $productForm = $this->createForm(ProductType::class);
        $categoryForm = $this->createForm(CategoryType::class);
        $categoryForm->handleRequest($request);
        $productForm->handleRequest($request);

        if ($productForm->isSubmitted() && $productForm->isValid()) {
            $newProduct = $productForm->getData();
            $this->em->persist($newProduct);
            $this->em->flush();
        }
        if ($categoryForm->isSubmitted() && $categoryForm->isValid()) {
            $newCategory = $categoryForm->getData();
            $this->em->persist($newCategory);
            $this->em->flush();
        }

        return $this->render('admin_products/index.html.twig', [
            'controller_name' => 'AdminProductController',
            'products' => $products,
            'categoryForm' => $categoryForm->createView(),
            'productForm' => $productForm->createView(),
        ]);
    }

    #[Route('/admin/produits/{id}', name: Routes::ADMIN_PRODUCT_EDIT)]
    public function edit(Request $request, Product $product): Response
    {
        $form = $this->createForm(ProductType::class, $product, [
            'categories' => $product->getCategories()->toArray(),
        ]);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $modifiedProduct = $form->getData();
            // dd($modifiedProduct);
            $this->em->persist($modifiedProduct);
            $this->em->flush();
        }

        return $this->render('admin_products/edit.html.twig', [
            'product' => $product,
            'productForm' => $form->createView(),
        ]);
    }
}
