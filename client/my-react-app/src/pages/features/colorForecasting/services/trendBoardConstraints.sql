alter table trend_board_colors
add constraint trend_board_colors_board_id_color_id_key
unique (board_id, color_id);
