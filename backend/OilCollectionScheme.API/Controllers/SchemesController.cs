using ClosedXML.Excel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OilCollectionScheme.API.Contracts;
using OilCollectionScheme.Application.Services;
using OilCollectionScheme.Core.Abstracts.Services;
using OilCollectionScheme.Core.Models;

namespace OilCollectionScheme.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SchemesController : ControllerBase
    {
        private readonly ISchemesService _schemesService;
        private readonly IPumpingStationsService _pumpingStationsService;
        private readonly IMeteringStationsService _meteringStationsService;
        private readonly IWellsService _wellsService;
        private readonly IProductParksService _productParksService;
        private readonly IPipesService _pipesService;

        public SchemesController(
            ISchemesService schemesService,
            IPumpingStationsService pumpingStationsService,
            IMeteringStationsService meteringStationsService,
            IWellsService wellsService,
            IProductParksService productParksService,
            IPipesService pipesService)
        {
            _schemesService = schemesService;
            _pumpingStationsService = pumpingStationsService;
            _meteringStationsService = meteringStationsService;
            _wellsService = wellsService;
            _productParksService = productParksService;
            _pipesService = pipesService;
        }

        [HttpGet]
        public async Task<ActionResult<Dictionary<string, List<SchemesResponse>>>> getAllSchemes()
        {
            var schemes = await _schemesService.GetAllSchemes();
            var response = schemes
                .Select(s => new SchemesResponse(s.SchemeId, s.Name, s.DepartmentId, s.DepartmentId))
                .ToList();
            var responseSorted = response.OrderBy(e => e.scheme_id).ToList();
            var result = new Dictionary<string, List<SchemesResponse>>() { ["schemes"] = responseSorted };
            return Ok(result);
        }

        [HttpGet("{scheme_id:int}")]
        public async Task<ActionResult<SchemesResponse>> getScheme(int scheme_id)
        {
            var scheme = await _schemesService.GetScheme(scheme_id);
            if (scheme == null)
            {
                return NotFound("Не найдена схема с scheme_id="+scheme_id);
            }
            var response = new SchemesResponse(scheme.SchemeId, scheme.Name, scheme.DepartmentId, scheme.UserId);
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<int>> createScheme([FromBody] SchemesRequest request)
        {
            var scheme = Scheme.Create(null, request.name, request.department_id, request.user_id).Scheme;

            var schemeId = await _schemesService.CreateScheme(scheme);

            return Ok(schemeId);
        }

        [HttpPut("{scheme_id:int}")]
        public async Task<ActionResult<int>> updateScheme(int scheme_id, [FromBody] SchemesRequest request)
        {
            var schemeId = await _schemesService.UpdateScheme(scheme_id, request.name, request.department_id, request.user_id);

            return Ok(schemeId);
        }

        [HttpDelete("{scheme_id:int}")]
        public async Task<ActionResult<int>> deleteScheme(int scheme_id)
        {
            var schemeId = await _schemesService.DeleteScheme(scheme_id);

            return Ok(schemeId);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpPost("/Import")]
        public async Task<ActionResult<string>> importSchemeData([FromForm(Name ="file")] IFormFile file)
        {
            var fileName = file.FileName;

            var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var workbook = new XLWorkbook(memoryStream);
            var random = new Random();
            //var scheme = Scheme.Create(null, "Схема " + random.Next(100), 1, 1).Scheme;
            //var schemeId = await _schemesService.CreateScheme(scheme);
            var schemeId = 4;
            //var headerRow = pumpingWorksheet.Row(2);
            //var columnMapping = new Dictionary<string, int>();
            var pumpingWorksheet = workbook.Worksheet("База ДНС");
            var pumpingDictionary = new Dictionary<string, int>();
            foreach (var row in pumpingWorksheet.RowsUsed().Skip(2))
            {
                Console.WriteLine(row.Cell(3).GetValue<string>());
                var name = row.Cell(3).GetValue<string>();
                var pressureWorking = row.Cell(5).GetValue<float>();
                var tankVolume = row.Cell(9).GetValue<float>();
                var throughput = row.Cell(10).GetValue<float>();
                var pumpingPerformance = row.Cell(11).GetValue<float>();
                var pumpingStation = new PumpingStation(
                    name, 
                    pressureWorking, 
                    tankVolume, 
                    throughput,
                    pumpingPerformance,
                    null,
                    schemeId);
                var pumpingStationId = await _pumpingStationsService.CreatePumpingStation(pumpingStation);
                pumpingDictionary.Add(name, pumpingStationId);
            }

            var meteringWorksheet = workbook.Worksheet("База ГЗУ");
            var meteringDictionary = new Dictionary<string, int>();
            var meteringTypes = await _meteringStationsService.GetMeteringStationTypes();
            var counterTypes = await _meteringStationsService.GetCounterTypes();
            foreach (var row in meteringWorksheet.RowsUsed().Skip(2))
            {
                Console.WriteLine(row.Cell(3).GetValue<string>());
                var name = "ГЗУ-" + row.Cell(3).GetValue<string>();
                var cycleTime = row.Cell(8).GetValue<float>();
                var pressure = row.Cell(9).GetValue<float>();
                var flowlineCount = row.Cell(10).GetValue<int>();

                var meteringTypeName = row.Cell(16).GetValue<string>();
                var meteringType = meteringTypes.Find((type) => type.Name == meteringTypeName);
                var meteringTypeId = meteringType!=null ? meteringType.MeteringStationTypeId : 1;

                var counterTypeName = row.Cell(13).GetValue<string>();
                var counterType = counterTypes.Find((type) => type.Name == counterTypeName);
                var counterTypeId = counterType != null ? counterType.CounterTypeId : 1;

                var meteringStation = new MeteringStation(
                    name,
                    cycleTime,
                    pressure,
                    flowlineCount,
                    meteringTypeId,
                    counterTypeId,
                    null,
                    schemeId);
                var meteringStationId = await _meteringStationsService.CreateMeteringStation(meteringStation);
                meteringDictionary.Add(name, meteringStationId);
                Console.WriteLine(name + " ----- " + meteringStationId);
            }

            var wellWorksheet = workbook.Worksheet("База скважин");
            var wellDictionary = new Dictionary<string, int>();
            var driveTypes = await _wellsService.GetDriveTypes();
            var wellPumps = await _wellsService.GetWellPumps();
            foreach (var row in wellWorksheet.RowsUsed().Skip(1))
            {
                Console.WriteLine(row.Cell(4).GetValue<string>());

                var name = "СКВ-" + row.Cell(4).GetValue<string>();

                var driveTypeName = row.Cell(10).GetValue<string>();
                var driveType = driveTypes.Find((type)=>type.Name == driveTypeName);
                var driverTypeId = driveType != null ? driveType.DriveTypeId : 1;

                var wellPumpName = row.Cell(13).GetValue<string>();
                var wellPump = wellPumps.Find((type) => type.Name == wellPumpName);
                var wellPumpId = wellPump != null ? wellPump.WellPumpId : 1;

                var lengthStroke = row.Cell(11).IsEmpty() ? 0f : row.Cell(11).GetValue<float>();
                var numberSwings = row.Cell(12).IsEmpty() ? 0f : row.Cell(12).GetValue<float>();
                var waterCut = row.Cell(17).GetValue<float>();
                var flowRate = row.Cell(19).GetValue<float>();
                var flowRateOil = row.Cell(20).GetValue<float>();

                var well = new Well(
                    name,
                    driverTypeId,
                    wellPumpId,
                    lengthStroke,
                    numberSwings,
                    waterCut,
                    flowRate,
                    flowRateOil,
                    null,
                    schemeId);
                var wellId = await _wellsService.CreateWell(well);
                wellDictionary.Add(name, (int) wellId);
            }

            var productPark = new ProductPark("ТП-" + random.Next(50), null, schemeId);
            var productParkId = await _productParksService.CreateProductPark(productPark);

            var pipeDictionary = new Dictionary<string, int>();
            foreach(var row in wellWorksheet.RowsUsed().Skip(1))
            {
                var startObjectName = "СКВ-" + row.Cell(4).GetValue<string>();
                var endObjectName = "ГЗУ-" + row.Cell(6).GetValue<string>();

                var name = startObjectName + " -- " + endObjectName;
                var startObjectId = wellDictionary[startObjectName];
                var startObjectTypeId = 1;
                var endObjectId = meteringDictionary[endObjectName];
                var endObjectTypeId = 2;

                var pipe = new Pipe(
                    name,
                    startObjectId,
                    startObjectTypeId,
                    endObjectId,
                    endObjectTypeId,
                    null,
                    schemeId);
                var pipeId = await _pipesService.CreatePipe(pipe);
                pipeDictionary.Add(name, pipeId);
            }
            foreach (var row in meteringWorksheet.RowsUsed().Skip(2))
            {
                var startObjectName = "ГЗУ-" + row.Cell(3).GetValue<string>();
                var endObjectName = row.Cell(6).GetValue<string>();

                var name = startObjectName + " -- " + endObjectName;
                var startObjectId = meteringDictionary[startObjectName];
                var startObjectTypeId = 2;
                var endObjectId = pumpingDictionary[endObjectName];
                var endObjectTypeId = 3;

                var pipe = new Pipe(
                    name,
                    startObjectId,
                    startObjectTypeId,
                    endObjectId,
                    endObjectTypeId,
                    null,
                    schemeId);
                var pipeId = await _pipesService.CreatePipe(pipe);
                pipeDictionary.Add(name, pipeId);
            }
            foreach (var row in pumpingWorksheet.RowsUsed().Skip(2))
            {
                var startObjectName = row.Cell(3).GetValue<string>();
                var endObjectName = productPark.Name;

                var name = startObjectName + " -- " + endObjectName;
                var startObjectId = pumpingDictionary[startObjectName];
                var startObjectTypeId = 3;
                var endObjectId = productParkId;
                var endObjectTypeId = 4;

                var pipe = new Pipe(
                    name,
                    startObjectId,
                    startObjectTypeId,
                    endObjectId,
                    endObjectTypeId,
                    null,
                    schemeId);
                var pipeId = await _pipesService.CreatePipe(pipe);
                pipeDictionary.Add(name, pipeId);
            }

            Console.WriteLine("\npumpingDictionary " + pumpingDictionary.Count);
            Console.WriteLine("\nmeteringDictionary " + meteringDictionary.Count);
            Console.WriteLine("\nwellDictionary " + wellDictionary.Count);
            Console.WriteLine("\npipeDictionary " + pipeDictionary.Count);

            return Ok(fileName);
        }
    }
}
