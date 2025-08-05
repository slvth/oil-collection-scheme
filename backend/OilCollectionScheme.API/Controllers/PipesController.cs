using Microsoft.AspNetCore.Mvc;
using OilCollectionScheme.API.Contracts;
using OilCollectionScheme.Core.Abstracts.Services;
using OilCollectionScheme.Core.Models;
using System.ComponentModel.DataAnnotations;

namespace OilCollectionScheme.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PipesController: ControllerBase
    {
        private readonly IPipesService _pipesService;

        public PipesController(IPipesService pipesService)
        {
            _pipesService = pipesService;
        }

        [HttpGet]
        public async Task<ActionResult<Dictionary<string, List<PipesResponse>>>> GetAllPipesBySchemeId([Required]int scheme_id)
        {
            var pipes = await _pipesService.GetAllPipesBySchemeId(scheme_id);
            var response = pipes.Select((pipe) => 
                new PipesResponse(
                    pipe.PipeId,
                    pipe.Name,
                    pipe.StartObjectId,
                    pipe.StartObjectTypeId,
                    pipe.EndObjectId,
                    pipe.EndObjectTypeId,
                    pipe.Coordinates,
                    pipe.SchemeId
                )
            ).ToList();
            var result = new Dictionary<string, List<PipesResponse>>() { ["pipes"] = response };
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreatePipe([FromBody] PipesRequest request)
        {
            var pipe = new Pipe(
                request.name,
                request.start_object_id,
                request.start_object_type_id,
                request.end_object_id,
                request.end_object_type_id,
                request.coordinates,
                request.scheme_id
            );
            var result = await _pipesService.CreatePipe(pipe);
            return Ok(result);
        }

        [HttpPut("{pipe_id:int}")]
        public async Task<ActionResult<int>> UpdatePipe(int pipe_id, [FromBody] PipesRequest request)
        {
            var pipe = new Pipe(
                pipe_id,
                request.name,
                request.start_object_id,
                request.start_object_type_id,
                request.end_object_id,
                request.end_object_type_id,
                request.coordinates,
                request.scheme_id
            );
            var result = await _pipesService.UpdatePipe(pipe);
            return Ok(result);
        }

        [HttpDelete("{pipe_id:int}")]
        public async Task<ActionResult<int>> DeletePipe(int pipe_id)
        {
            var result = await _pipesService.DeletePipe(pipe_id);
            return Ok(result);
        }
    }
}
