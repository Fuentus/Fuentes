const { Router } = require('express')
const express = require('express')

const router = new Router()


router.get('/admin', (req, res) => {
    
})

router.post('/admin/quote-listing', (req, res) => {
    
})

router.delete('/admin/quote:id', (req, res) => {
    
})

router.update('/admin/quote:id', (req, res) => {
    
})

router.post('/admin/quote:id', (req, res) => {
    
})

router.get('/admin/operation', (req, res) => {
    
})

router.get('/admin/operation/all', (req, res) => {
    
})

router.post('/admin/operation/add', (req, res) => {
    
})

router.update('/admin/operation/:id', (req, res) => {
    
})

router.delete('/admin/operation/:id', (req, res) => {
    
})

//admin/inventory

router.get('/admin/inventory', (req, res) => {
    
})

router.get('/admin/inventory/operations', (req, res) => {
    
})

router.update('/admin/inventory/:id', (req, res) => {
    
})

router.post('/admin/inventory/:id', (req, res) => {
    
})

router.delete('/admin/inventory/:id', (req, res) => {
    
})

//admin/workers

router.get('/admin/workers', (req, res) => {
    
})

router.get('/admin/workers/operations', (req, res) => {
    
})

router.update('/admin/worker/:id', (req, res) => {
    
})

router.delete('/admin/worker/:id', (req, res) => {
    
})

router.post('/admin/worker/:id', (req, res) => {
    
})

//admin/projects

router.get('/admin/projects', (req, res) => {
    
})

router.get('/admin/projects/operations', (req, res) => {
    
})

router.get('/admin/projects/inventory', (req, res) => {
    
})

router.get('/admin/projects/workers', (req, res) => {
    
})

router.post('/admin/projects/workers', (req, res) => {
    
})

router.post('/admin/projects/status', (req, res) => {
    
})

router.delete('/admin/project:id', (req, res) => {
    
})

router.update('/admin/project:id', (req, res) => {
    
})

//inspections

router.get('/admin/inspections', (req, res) => {
    
})

router.get('/admin/inspections/fair-inspections', (req, res) => {
    
})

router.post('/admin/inspections/fair-inspections/add', (req, res) => {
    
})

router.update('/admin/inspections/fair-inspections/:id', (req, res) => {
    
})

router.delete('/admin/inspections/fair-inspections/:id', (req, res) => {
    
})
router.get('/admin/inspections/standard-inspections', (req, res) => {
    
})

router.post('/admin/inspections/standard-inspections/add', (req, res) => {
    
})

router.update('/admin/inspections/standard-inspections/:id', (req, res) => {
    
})

router.delete('/admin/inspections/standard-inspections/:id', (req, res) => {
    
})

module.exports = adminRouter;


