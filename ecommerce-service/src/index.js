const createExpressApp = require('./frameworks/http/express');
const SequelizeClient = require('./frameworks/db/sequelize');

// Users
const createUsersRouter = require('./users/http/users-router');
const ManageUsersUsecase = require('./users/usecases/manage-users-usecase');
const SequelizeUsersRepository = require('./users/repositories/sequelize-users-repository');

// Places
const createPlacesRouter = require('./places/http/places-router');
const ManagePlacesUsecase = require('./places/usecases/manage-places-usecase');
const SequelizePlacesRepository = require('./places/repositories/sequelize-places-repository');

// Categories
const createCategoriesRouter = require('./categories/http/categories-router');
const ManageCategoriesUsecase = require('./categories/usecases/manage-categories-usecase');
const SequelizeCategoriesRepository = require('./categories/repositories/sequelize-categories-repository');

// Providers
const createProvidersRouter = require('./providers/http/providers-router');
const ManageProvidersUsecase = require('./providers/usecases/manage-providers-usecase');
const SequelizeProvidersRepository = require('./providers/repositories/sequelize-providers-repository');

// Vehicles
const createVehiclesRouter = require('./vehicles/http/vehicles-router');
const ManageVehiclesUsecase = require('./vehicles/usecases/manage-vehicles-usecase');
const SequelizeVehiclesRepository = require('./vehicles/repositories/sequelize-vehicles-repository');

// Vehicle Categories
const createVehicleCategoriesRouter = require('./vehicle-categories/http/vehicle-categories-router');
const ManageVehicleCategoriesUsecase = require('./vehicle-categories/usecases/manage-vehicle-categories-usecase');
const SequelizeVehicleCategoriesRepository = require('./vehicle-categories/repositories/sequelize-vehicle-categories-repository');

// Coverages
const createCoveragesRouter = require('./coverages/http/coverages-router');
const ManageCoveragesUsecase = require('./coverages/usecases/manage-coverages-usecase');
const SequelizeCoveragesRepository = require('./coverages/repositories/sequelize-coverages-repository');

// Prices
const createPricesRouter = require('./prices/http/prices-router');
const ManagePricesUsecase = require('./prices/usecases/manage-prices-usecase');
const SequelizePricesRepository = require('./prices/repositories/sequelize-prices-repository');

// Quotations
const createQuotationsRouter = require('./quotations/http/quotations-router');
const ManageQuotationsUsecase = require('./quotations/usecases/manage-quotations-usecase');
const SequelizeQuotationsRepository = require('./quotations/repositories/sequelize-quotations-repository');
const sequelize = require('sequelize');


// Instanciar dependencias.

const sequelizeClient = new SequelizeClient();
const sequelizeUsersRepository = new SequelizeUsersRepository(sequelizeClient);
const sequelizePlacesRepository = new SequelizePlacesRepository(sequelizeClient);
const sequelizeCategoriesRepository = new SequelizeCategoriesRepository(sequelizeClient);
const sequelizeProvidersRepository = new SequelizeProvidersRepository(sequelizeClient);
const sequelizeVehiclesRepository = new SequelizeVehiclesRepository(sequelizeClient);
const sequelizeVehicleCategoriesRepository = new SequelizeVehicleCategoriesRepository(sequelizeClient);
const sequelizeCoveragesRepository = new SequelizeCoveragesRepository(sequelizeClient);
const sequelizePricesRepository = new SequelizePricesRepository(sequelizeClient);
const sequelizeQuotationsRepository = new SequelizeQuotationsRepository(sequelizeClient);

sequelizeClient.syncDatabase([
  sequelizeUsersRepository,
  sequelizePlacesRepository,
  sequelizeCategoriesRepository,
  sequelizeProvidersRepository,
  sequelizeVehiclesRepository,
  sequelizeVehicleCategoriesRepository,
  sequelizeCoveragesRepository,
  sequelizePricesRepository,
]);

const manageUsersUsecase = new ManageUsersUsecase(sequelizeUsersRepository);
const managePlacesUsecase = new ManagePlacesUsecase(sequelizePlacesRepository);
const manageCategoriesUsecase = new ManageCategoriesUsecase(sequelizeCategoriesRepository);
const manageProvidersUsecase = new ManageProvidersUsecase(sequelizeProvidersRepository);
const manageVehiclesUsecase = new ManageVehiclesUsecase(
  sequelizeVehiclesRepository,
  sequelizeProvidersRepository,
  sequelizeVehicleCategoriesRepository,
  sequelizeCategoriesRepository
);
const manageVehicleCategoriesUsecase = new ManageVehicleCategoriesUsecase(
  sequelizeVehicleCategoriesRepository,
  sequelizeVehiclesRepository,
  sequelizeCategoriesRepository
);
const manageCoveragesUsecase = new ManageCoveragesUsecase(
  sequelizeCoveragesRepository,
  sequelizePlacesRepository,
  sequelizeProvidersRepository,
  sequelizeVehiclesRepository
);
const managePricesUsecase = new ManagePricesUsecase(
  sequelizePricesRepository,
  sequelizeCoveragesRepository
);
const manageQuotationsUsecase = new ManageQuotationsUsecase(
  sequelizeQuotationsRepository,
  sequelizeUsersRepository,
  sequelizePlacesRepository,
  sequelizeCoveragesRepository,
  sequelizeProvidersRepository,
  sequelizePricesRepository,
  sequelizeVehiclesRepository,
  sequelizeCategoriesRepository,
  sequelizeVehicleCategoriesRepository
);

let routers = [
  createUsersRouter(manageUsersUsecase),
  createPlacesRouter(managePlacesUsecase),
  createCategoriesRouter(manageCategoriesUsecase),
  createProvidersRouter(manageProvidersUsecase),
  createVehiclesRouter(manageVehiclesUsecase),
  createVehicleCategoriesRouter(manageVehicleCategoriesUsecase),
  createCoveragesRouter(manageCoveragesUsecase),
  createPricesRouter(managePricesUsecase),
  createQuotationsRouter(manageQuotationsUsecase),
];

// Crear aplicación Express con dependencias inyectadas.
const app = createExpressApp(routers);
