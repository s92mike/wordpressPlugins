<section class="app-calculators-container">
	<article>
		<h1 class="app-heading-inline">RapidVisa Calculators</h1>
    <hr />
    <div class="admin-content">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">RV Calculators</th>
            <th scope="col">Short Codes</th>
          </tr>
        </thead>
        <tbody>
<?php
        foreach ($shortcodes as $index => $shortcode):
?>
          <tr>
            <td><?php echo $shortTitleList[$shortcode]?></td>
            <td>[<?php echo $shortcode; ?>]</td>
          </tr>
<?php
        endforeach;
?>
        </tbody>
      </table>
    </div>
	</article>
</section>
