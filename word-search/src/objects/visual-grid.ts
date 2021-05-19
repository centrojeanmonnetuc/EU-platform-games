import { ObjectPosition } from "../interfaces/utils.interface";
import { Cell } from "./cell";

export class VisualGrid {
  private scene: Phaser.Scene;
  private cells: Cell[] = [];

  private cell_size: number;
  private grid_container: Phaser.GameObjects.Container;

  constructor(
    scene: Phaser.Scene,
    grid: string[][],
    num_hor_cells: number,
    num_ver_cells: number,
    grid_w: number,
    grid_h: number,
    side_gap: number,
    cells_gap: number
  ) {
    this.scene = scene;

    this.setCellSize(
      num_hor_cells,
      num_ver_cells,
      grid_w,
      grid_h,
      side_gap,
      cells_gap
    );

    this.visualWordSearch(grid, num_hor_cells, num_ver_cells, cells_gap);
  }

  private drawWordLine(): void {}

  private visualWordSearch(
    grid: string[][],
    num_hor_cells: number,
    num_ver_cells: number,
    cells_gap: number
  ): void {
    var cell_text = this.scene.add
      .text(0, 0, "*", {
        fontFamily: "Arial",
        fontSize: this.cell_size / 1.5,
        color: 0x696969,
        align: "center",
      })
      .setVisible(false);

    var cell_body = this.scene.add.graphics();
    cell_body.fillStyle(0xffffff, 1);
    cell_body.fillRoundedRect(0, 0, this.cell_size, this.cell_size, 0);
    cell_body.setVisible(false);

    this.grid_container = this.scene.add.container(0, 0);
    var cell_texture_name, cell_char;
    var grid_w_counter = 0,
      grid_h_counter = 0;

    for (let i = 0; i < num_ver_cells; i++) {
      grid_w_counter = 0;
      for (let j = 0; j < num_hor_cells; j++) {
        var rt = this.scene.add
          .renderTexture(0, 0, this.cell_size, this.cell_size)
          .setVisible(false);

        // cell char
        cell_char = grid[i][j];

        // setText
        cell_text.setText(cell_char);
        let cell_text_center_w = Math.floor(
          (this.cell_size - cell_text.width) / 2
        );
        let cell_text_center_h = Math.floor(
          (this.cell_size - cell_text.height) / 2
        );

        rt.draw(cell_body, 0, 0);
        rt.draw(cell_text, cell_text_center_w, cell_text_center_h);

        cell_texture_name = "cell_" + i + "_" + j;
        rt.saveTexture(cell_texture_name);

        const cell = new Cell(
          this.scene,
          grid_w_counter,
          grid_h_counter,
          cell_texture_name,
          { x: j, y: i },
          grid[i][j]
        );

        this.cells.push(cell);

        grid_w_counter += this.cell_size + cells_gap;
        this.grid_container.add(cell.getCellImg());
      }
      grid_h_counter += this.cell_size + cells_gap;
    }
    // grid_container.setPosition(
    //   s_width / 2 - grid_w_counter / 2,
    //   bar_size_height + main_puzzle_height / 2 - grid_h_counter / 2
    // );
    // grid_container.setData("container_w", grid_w_counter);
    // grid_container.setData("container_h", grid_h_counter);

    // SELECTION = this.add.graphics();
    // var line = new Phaser.Geom.Line();

    // var word_strikethrough = this.add.graphics({
    //   lineStyle: { width: 3, color: yellow, alpha: 0.6 },
    // });

    // this.input.on("pointerdown", (pointer) =>
    //   this.lineOriginHandler(pointer, line, SELECTION, grid_container)
    // );
    // this.input.on("pointermove", (pointer) =>
    //   this.lineMovingHandler(pointer, SELECTION, line, grid_container)
    // );
    // this.input.on("pointerup", () =>
    //   this.lineEndHandler(SELECTION, grid_container, word_strikethrough)
    // );
  }

  private setCellSize(
    num_hor_cells: number,
    num_ver_cells: number,
    grid_w: number,
    grid_h: number,
    side_gap: number,
    cells_gap: number
  ): void {
    var temp_cell_size_h, temp_cell_size_w;
    var total_cell_size_h = (grid_h - 2 * side_gap) / num_ver_cells;
    temp_cell_size_h = total_cell_size_h - cells_gap;

    var total_cell_size_w = (grid_w - 2 * side_gap) / num_hor_cells;
    temp_cell_size_w = total_cell_size_w - cells_gap;

    this.cell_size = Math.min(temp_cell_size_w, temp_cell_size_h);

    //if (this.cell_size > 50) this.cell_size = 50;
  }

  public getCells(): Cell[] {
    return this.cells;
  }
}
